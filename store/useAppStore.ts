import { create } from "zustand";
import type { UploadedFile, LogEntry, ChatMessage, ConversationSession } from "@/types";

function newSession(title = "Nouvelle discussion"): ConversationSession {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
    lastMessageAt: null,
    messages: [],
  };
}

interface AppState {
  // ── Conversation sessions ────────────────────────────────
  sessions: ConversationSession[];
  activeSessionId: string;
  createSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessageToSession: (sessionId: string, msg: ChatMessage) => void;
  updateLastAssistantMessage: (sessionId: string, msgId: string, content: string) => void;
  setSessionTitle: (sessionId: string, title: string) => void;

  // ── Fichiers uploadés ────────────────────────────────────
  files: UploadedFile[];
  setFiles: (files: UploadedFile[]) => void;
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;

  // ── Tâche en cours d'exécution ───────────────────────────
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;

  // ── Progression ──────────────────────────────────────────
  progress: number;
  setProgress: (p: number) => void;

  // ── Logs d'exécution en temps réel ───────────────────────
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;

  // ── Statut agent ─────────────────────────────────────────
  agentOnline: boolean;
  setAgentOnline: (online: boolean) => void;

  // ── ID résultat du dernier run ───────────────────────────
  lastResultId: string | null;
  setLastResultId: (id: string | null) => void;
}

const initialSession = newSession();

export const useAppStore = create<AppState>((set, get) => ({
  // ── Sessions ─────────────────────────────────────────────
  sessions: [initialSession],
  activeSessionId: initialSession.id,

  createSession: () => {
    const s = newSession();
    set((state) => ({ sessions: [s, ...state.sessions], activeSessionId: s.id }));
    return s.id;
  },

  setActiveSession: (id) => set({ activeSessionId: id }),

  deleteSession: (id) =>
    set((state) => {
      const remaining = state.sessions.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const s = newSession();
        return { sessions: [s], activeSessionId: s.id };
      }
      const activeId =
        state.activeSessionId === id ? remaining[0].id : state.activeSessionId;
      return { sessions: remaining, activeSessionId: activeId };
    }),

  addMessageToSession: (sessionId, msg) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, msg], lastMessageAt: msg.timestamp }
          : s
      ),
    })),

  updateLastAssistantMessage: (sessionId, msgId, content) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msgId ? { ...m, content } : m
              ),
            }
          : s
      ),
    })),

  setSessionTitle: (sessionId, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, title } : s
      ),
    })),

  // ── Files ─────────────────────────────────────────────────
  files: [],
  setFiles: (files) => set({ files }),
  addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  // ── Task execution ────────────────────────────────────────
  activeTaskId: null,
  setActiveTaskId: (id) => set({ activeTaskId: id }),

  progress: 0,
  setProgress: (progress) => set({ progress }),

  logs: [],
  addLog: (log) =>
    set((s) => ({ logs: [...s.logs.slice(-199), log] })),
  clearLogs: () => set({ logs: [] }),

  agentOnline: false,
  setAgentOnline: (agentOnline) => set({ agentOnline }),

  lastResultId: null,
  setLastResultId: (lastResultId) => set({ lastResultId }),
}));
