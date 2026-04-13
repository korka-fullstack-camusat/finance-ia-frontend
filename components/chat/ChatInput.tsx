"use client";
import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface Props { onSend: (msg: string) => void; disabled?: boolean; }

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className={`flex items-end gap-2 bg-white border rounded-2xl shadow-sm px-4 py-3 transition-all ${
        disabled ? "opacity-60" : "border-[#E2E8F0] hover:border-[#2563EB]/40 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]/20"
      }`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Posez une question financière..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none leading-relaxed"
          style={{ minHeight: "24px", maxHeight: "160px" }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 hover:bg-[#1D4ED8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className="text-center text-[10px] text-[#94A3B8] mt-2">
        FinanceAI peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  );
}
