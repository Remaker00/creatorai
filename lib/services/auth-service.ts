import type { AuthState, PlanId } from "@/lib/types";
import { apiRequest } from "./http";

export { ApiError } from "./http";

export const authService = {
  signup(input: { name: string; email: string; password: string }): Promise<AuthState> {
    return apiRequest("POST", "/api/auth/signup", input);
  },

  login(input: { email: string; password: string }): Promise<AuthState> {
    return apiRequest("POST", "/api/auth/login", input);
  },

  logout(): Promise<void> {
    return apiRequest("POST", "/api/auth/logout");
  },

  me(): Promise<AuthState> {
    return apiRequest("GET", "/api/auth/me");
  },

  selectPlan(plan: PlanId): Promise<AuthState> {
    return apiRequest("POST", "/api/workspace/plan", { plan });
  },
};
