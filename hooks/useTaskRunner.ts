"use client";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export function useTaskRunner() {
  const { setActiveTaskId, setProgress, addLog, clearLogs, setLastResultId } =
    useAppStore();
  const qc = useQueryClient();

  const runTask = useCallback(
    async (taskId: string) => {
      clearLogs();
      setProgress(0);
      setActiveTaskId(taskId);
      setLastResultId(null);

      try {
        const response = await fetch(`${API_BASE}/api/tasks/${taskId}/run`, {
          method: "POST",
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            try {
              // Parse JSON-like SSE payload (single-quoted keys converted)
              const json = raw.replace(/'/g, '"');
              const event = JSON.parse(json);

              if (event.type === "log") {
                addLog({
                  id: crypto.randomUUID(),
                  message: event.message,
                  timestamp: new Date().toISOString(),
                  type: "log",
                });
              } else if (event.type === "progress") {
                setProgress(event.value ?? 0);
              } else if (event.type === "result") {
                setLastResultId(event.result_id);
                qc.invalidateQueries({ queryKey: ["results"] });
                qc.invalidateQueries({ queryKey: ["tasks"] });
              } else if (event.type === "error") {
                addLog({
                  id: crypto.randomUUID(),
                  message: `Erreur : ${event.message}`,
                  timestamp: new Date().toISOString(),
                  type: "error",
                });
              } else if (event.type === "done") {
                setProgress(100);
                qc.invalidateQueries({ queryKey: ["notifications"] });
              }
            } catch {
              // Ignore parse errors on malformed lines
            }
          }
        }
      } catch (err: any) {
        addLog({
          id: crypto.randomUUID(),
          message: `Erreur réseau : ${err.message}`,
          timestamp: new Date().toISOString(),
          type: "error",
        });
      } finally {
        setActiveTaskId(null);
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
    [setActiveTaskId, setProgress, addLog, clearLogs, setLastResultId, qc]
  );

  return { runTask };
}
