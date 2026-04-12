import { create } from "zustand";
import type { UploadedFile, LogEntry, TaskRunEvent } from "@/types";

interface AppState {
  // Fichiers uploadés
  files: UploadedFile[];
  setFiles: (files: UploadedFile[]) => void;
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;

  // Tâche en cours d'exécution
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;

  // Progression
  progress: number;
  setProgress: (p: number) => void;

  // Logs d'exécution en temps réel
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;

  // Statut agent
  agentOnline: boolean;
  setAgentOnline: (online: boolean) => void;

  // ID résultat du dernier run
  lastResultId: string | null;
  setLastResultId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  activeTaskId: null,
  setActiveTaskId: (id) => set({ activeTaskId: id }),

  progress: 0,
  setProgress: (progress) => set({ progress }),

  logs: [],
  addLog: (log) =>
    set((s) => ({
      logs: [...s.logs.slice(-199), log], // garder max 200 logs
    })),
  clearLogs: () => set({ logs: [] }),

  agentOnline: false,
  setAgentOnline: (agentOnline) => set({ agentOnline }),

  lastResultId: null,
  setLastResultId: (lastResultId) => set({ lastResultId }),
}));
