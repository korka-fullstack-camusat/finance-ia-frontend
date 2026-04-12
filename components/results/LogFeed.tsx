"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { formatDate } from "@/lib/utils";

export function LogFeed() {
  const logs = useAppStore((s) => s.logs);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="bg-[#0d0d10] border border-white/5 rounded-lg p-3 font-mono text-[11px] max-h-40 overflow-y-auto mb-3">
      <p className="text-gray-500 text-[10px] mb-2 uppercase tracking-widest">Journal d'exécution</p>
      <div className="space-y-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex gap-2 animate-fadeIn ${
              log.type === "error" ? "text-red-400" : "text-green-300"
            }`}
          >
            <span className="text-gray-600 shrink-0">{formatDate(log.timestamp)}</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
