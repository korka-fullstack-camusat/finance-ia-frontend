"use client";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder="Posez une question financière..."
        rows={2}
        className="flex-1 bg-[#0d0d10] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-gray-200 font-mono resize-none placeholder:text-gray-600 focus:outline-none focus:border-[#7c6ff7]/50 transition-colors disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="px-3 py-2 bg-[#7c6ff7] text-white rounded-lg text-[12px] font-semibold hover:bg-[#6c5fe7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
      >
        ▶
      </button>
    </div>
  );
}
