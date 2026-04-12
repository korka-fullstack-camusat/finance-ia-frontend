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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
          Agent IA
        </h2>
        {streaming && (
          <span className="text-[10px] text-[#7c6ff7] font-mono animate-pulse">
            Réflexion...
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center">
            <span className="text-2xl mb-2">🤖</span>
            <p className="text-[11px] font-mono">
              Bonjour ! Posez-moi vos questions financières.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  );
}
