"use client";
import { useEffect } from "react";
import { checkHealth } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export function TopBar() {
  const { agentOnline, setAgentOnline } = useAppStore();

  useEffect(() => {
    const check = async () => {
      try { await checkHealth(); setAgentOnline(true); }
      catch { setAgentOnline(false); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [setAgentOnline]);

  return (
    <header className="h-12 bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-4 shrink-0 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
          <span className="text-white text-sm font-bold">F</span>
        </div>
        <span className="font-semibold text-[#0F172A] text-[15px] tracking-tight">
          Finance<span className="text-[#2563EB]">AI</span>
        </span>
      </div>

      <div className="w-px h-5 bg-[#E2E8F0]" />

      {/* Agent status */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${agentOnline ? "bg-emerald-500" : "bg-red-400"}`} />
        <span className="text-xs text-[#64748B]">
          Agent {agentOnline ? "connecté" : "hors ligne"}
        </span>
      </div>

      <div className="ml-auto text-xs text-[#94A3B8]">
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>
    </header>
  );
}
