"use client";
import { useState, useCallback, useRef } from "react";
import { API_BASE } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { ChatMessage } from "@/types";

export function useChat() {
  const {
    sessions,
    activeSessionId,
    addMessageToSession,
    updateLastAssistantMessage,
    setSessionTitle,
  } = useAppStore();

  const session = sessions.find((s) => s.id === activeSessionId);
  const messages = session?.messages ?? [];

  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string, fileIds: string[] = []) => {
      if (!text.trim() || streaming) return;

      const sessionId = activeSessionId;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      addMessageToSession(sessionId, userMsg);

      // Auto-title: use first user message as session title
      if ((session?.messages.length ?? 0) === 0) {
        const title = text.length > 45 ? text.slice(0, 45) + "…" : text;
        setSessionTitle(sessionId, title);
      }

      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      addMessageToSession(sessionId, assistantMsg);
      setStreaming(true);

      abortRef.current = new AbortController();

      try {
        const response = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, file_ids: fileIds }),
          signal: abortRef.current.signal,
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              if (data.startsWith("[ERROR]")) {
                accumulated += `\n⚠️ ${data.slice(7)}`;
              } else {
                accumulated += data.replace(/\\n/g, "\n");
              }
              updateLastAssistantMessage(sessionId, assistantId, accumulated);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          updateLastAssistantMessage(
            sessionId,
            assistantId,
            "⚠️ Erreur de connexion à l'agent IA."
          );
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [streaming, activeSessionId, session, addMessageToSession, updateLastAssistantMessage, setSessionTitle]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, streaming, sendMessage, stopStreaming };
}
