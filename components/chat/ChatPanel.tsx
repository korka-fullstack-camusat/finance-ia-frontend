"use client";
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { useAppStore } from "@/store/useAppStore";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatPanel() {
  const { messages, streaming, sendMessage, stopStreaming } = useChat();
  const { sessions, activeSessionId } = useAppStore();
  const session = sessions.find((s) => s.id === activeSessionId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header — current session title */}
      <div className="h-11 border-b border-[#E2E8F0] flex items-center justify-between px-5 shrink-0 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">F</span>
          </div>
          <span className="text-sm font-semibold text-[#0F172A] truncate">
            {session?.title ?? "Nouvelle discussion"}
          </span>
        </div>

        {streaming && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <button
              onClick={stopStreaming}
              className="text-[11px] text-[#64748B] hover:text-red-500 border border-[#E2E8F0] px-2 py-0.5 rounded-lg transition-colors"
            >
              Arrêter
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pb-10 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
              <span className="text-[#2563EB] text-xl font-bold">F</span>
            </div>
            <p className="text-[15px] font-semibold text-[#0F172A]">Comment puis-je vous aider ?</p>
            <p className="text-[13px] text-[#94A3B8] text-center max-w-xs">
              Posez une question financière ou lancez une tâche depuis le panneau de gauche.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-1">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-[#E2E8F0]">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}
