"use client";
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatPanel() {
  const { messages, streaming, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="h-12 bg-white border-b border-[#E2E8F0] flex items-center px-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">FinanceAI</span>
        </div>
        {streaming && (
          <div className="ml-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse-dot" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse-dot" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse-dot" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-[#F8FAFC]">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}
