"use client";
import type { ChatMessage as ChatMsg } from "@/types";

interface Props { message: ChatMsg; }

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-6 py-1 animate-fadeIn">
        <div className="max-w-[75%] bg-[#2563EB] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-6 py-1 animate-fadeIn">
      {/* Avatar FinanceAI */}
      <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <span className="text-white text-xs font-bold">F</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#2563EB] mb-1">FinanceAI</p>
        <div
          className={`text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap ${
            !message.content ? "typing-cursor" : ""
          }`}
        >
          {message.content || " "}
        </div>
      </div>
    </div>
  );
}
