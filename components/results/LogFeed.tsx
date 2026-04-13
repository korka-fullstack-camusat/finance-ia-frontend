"use client";
import { useAppStore } from "@/store/useAppStore";

export function LogFeed() {
  const logs = useAppStore((s) => s.logs);
  if (logs.length === 0) return null;

  return (
    <div className="space-y-0.5 mt-1 max-h-24 overflow-y-auto">
      {logs.slice(-5).map((log) => (
        <div key={log.id} className={`flex items-start gap-1.5 text-[11px] ${log.type === "error" ? "text-red-500" : "text-[#2563EB]"}`}>
          <span className="mt-0.5 shrink-0">{log.type === "error" ? "✕" : "›"}</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  );
}
