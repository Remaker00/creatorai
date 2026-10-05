import { db } from "@/lib/server/db/client";
import { SESSION_RENEW_WITHIN_MS, SESSION_TTL_MS } from "@/lib/server/auth/config";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { generateId, generateSessionToken, hashSessionToken } from "@/lib/server/auth/tokens";
import { HttpError } from "@/lib/server/http";
import { sessionRepository } from "@/lib/server/repositories/session-repository";
import { socialAccountRepository } from "@/lib/server/repositories/social-account-repository";
import { userRepository, type UserRow } from "@/lib/server/repositories/user-repository";
import { workspaceRepository, type WorkspaceRow } from "@/lib/server/repositories/workspace-repository";
import type { AuthState, PlanId, WorkspaceRole } from "@/lib/types";

/** Server-only view of the current request's session. Never serialize it; send `state` instead. */
export interface AuthContext {
  state: AuthState;
  sessionId: string;
  expiresAt: Date;
}

export interface IssuedSession {
  state: AuthState;
  token: string;
  expiresAt: Date;
}

// DTO: the only place DB rows become API-visible auth data.
function toAuthState(user: UserRow, workspace: WorkspaceRow, role: WorkspaceRole, instagramConnected: boolean): AuthState {
  return {
    user: { id: user.id, name: user.name, email: user.email },
    workspace: {
      id: workspace.id,
      name: workspace.name,
      role,
      plan: workspace.plan,
      instagramConnected,
    },
  };
}

function isUniqueViolation(error: unknown): boolean {
  // Drizzle wraps pg errors; the SQLSTATE lives on the error or its cause.
  for (let e: unknown = error; e instanceof Error; e = e.cause) {
    if ((e as { code?: unknown }).code === "23505") return true;
  }
  return false;
}

const newSessionSecrets = () => {
  const token = generateSessionToken();
  return { token, id: hashSessionToken(token), expiresAt: new Date(Date.now() + SESSION_TTL_MS) };
};

export const authServerService = {
  /** User, workspace, owner membership and session are created atomically. */
  async signup(input: { name: string; email: string; password: string }): Promise<IssuedSession> {
    const passwordHash = await hashPassword(input.password);
    const { token, id, expiresAt } = newSessionSecrets();
    try {
      return await db.transaction(async (tx) => {
        const user = await userRepository.insert(
          { id: generateId("usr"), email: input.email, name: input.name, passwordHash },
          tx,
        );
        const workspace = await workspaceRepository.insert(
          { id: generateId("ws"), name: `${input.name.split(" ")[0]}'s workspace` },
          tx,
        );
        await workspaceRepository.addMember(workspace.id, user.id, "owner", tx);
        await sessionRepository.insert({ id, userId: user.id, workspaceId: workspace.id, expiresAt }, tx);
        return { state: toAuthState(user, workspace, "owner", false), token, expiresAt };
      });
    } catch (error) {
      if (isUniqueViolation(error)) throw new HttpError(409, "An account with this email already exists", "email");
      throw error;
    }
  },

  async login(input: { email: string; password: string }): Promise<IssuedSession> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      await burnPasswordCheck(input.password);
      throw new HttpError(401, "Invalid email or password");
    }
    if (!(await verifyPassword(input.password, user.passwordHash))) throw new HttpError(401, "Invalid email or password");

    const membership = await workspaceRepository.findDefaultMembership(user.id);
    if (!membership) throw new HttpError(403, "This account has no workspace");

    const instagramConnected = await socialAccountRepository.hasPlatform(membership.workspace.id, "instagram");
    await sessionRepository.deleteExpiredForUser(user.id, new Date());
    const { token, id, expiresAt } = newSessionSecrets();
    await sessionRepository.insert({ id, userId: user.id, workspaceId: membership.workspace.id, expiresAt });
    return {
      state: toAuthState(user, membership.workspace, membership.role, instagramConnected),
      token,
      expiresAt,
    };
  },

  async resolve(token: string): Promise<AuthContext | null> {
    const sessionId = hashSessionToken(token);
    const record = await sessionRepository.findWithContext(sessionId);
    if (!record) return null;
    if (record.session.expiresAt.getTime() <= Date.now()) {
      await sessionRepository.delete(sessionId);
      return null;
    }
    return {
      state: toAuthState(record.user, record.workspace, record.role, record.instagramConnected),
      sessionId,
      expiresAt: record.session.expiresAt,
    };
  },

  /** Sliding expiry; returns the new expiry when the session was extended. */
  async renewIfNeeded(auth: AuthContext): Promise<Date | null> {
    if (auth.expiresAt.getTime() - Date.now() > SESSION_RENEW_WITHIN_MS) return null;
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await sessionRepository.extend(auth.sessionId, expiresAt);
    return expiresAt;
  },

  async logout(token: string): Promise<void> {
    await sessionRepository.delete(hashSessionToken(token));
  },

  async selectPlan(auth: AuthContext, plan: PlanId): Promise<AuthState> {
    const { workspace } = auth.state;
    const updated = await workspaceRepository.setPlan(workspace.id, plan);
    if (!updated) throw new HttpError(404, "Workspace not found");
    return { user: auth.state.user, workspace: { ...workspace, plan: updated.plan } };
  },
};
