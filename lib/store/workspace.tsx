"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAccounts, type AccountsSlice } from "./use-accounts";
import { useAiSettings, type AiSettingsSlice } from "./use-ai-settings";
import { useAnalytics, type AnalyticsSlice } from "./use-analytics";
import { useAutomations, type AutomationsSlice } from "./use-automations";
import { useComments, type CommentsSlice } from "./use-comments";
import { useConversations, type ConversationsSlice } from "./use-conversations";
import { useSessionStats, type SessionStatsSlice } from "./use-session-stats";

interface Workspace {
  conversations: ConversationsSlice;
  comments: CommentsSlice;
  automations: AutomationsSlice;
  aiSettings: AiSettingsSlice;
  accounts: AccountsSlice;
  analytics: AnalyticsSlice;
  session: SessionStatsSlice;
}

const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const session = useSessionStats();
  const aiSettings = useAiSettings();
  const automations = useAutomations();
  const accounts = useAccounts();
  const analytics = useAnalytics(session.stats);
  const aiDeps = { settings: aiSettings.settings, automations: automations.items, stats: session };
  const conversations = useConversations(aiDeps);
  const comments = useComments(aiDeps);

  return (
    <WorkspaceContext value={{ conversations, comments, automations, aiSettings, accounts, analytics, session }}>
      {children}
    </WorkspaceContext>
  );
}

export function useWorkspace(): Workspace {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return workspace;
}
