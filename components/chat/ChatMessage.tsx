"use client";
import type { ChatMessage as ChatMsg } from "@/types";

interface ChatMessageProps {
  message: ChatMsg;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
          isUser
            ? "bg-[#7c6ff7]/20 text-white border border-[#7c6ff7]/30"
            : "bg-[#1c1c22] text-gray-200 border border-white/5"
        }`}
      >
        {!isUser && (
          <p className="text-[9px] text-[#7c6ff7] font-mono uppercase tracking-widest mb-1">
            FinanceAI
          </p>
        )}
        <p className="whitespace-pre-wrap">{message.content || "▊"}</p>
      </div>
    </div>
  );
}
