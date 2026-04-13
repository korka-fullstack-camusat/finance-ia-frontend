"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkHealth } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useNotifications, useMarkRead } from "@/hooks/useNotifications";

export function TopBar() {
  const router = useRouter();
  const { agentOnline, setAgentOnline } = useAppStore();
  const { data: notifications } = useNotifications();
  const markRead = useMarkRead();
  const unread = (notifications || []).filter((n) => !n.is_read);
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("financeai_auth");
      if (raw) setUsername(JSON.parse(raw).user ?? "");
    } catch {}
  }, []);

  useEffect(() => {
    const check = async () => {
      try { await checkHealth(); setAgentOnline(true); }
      catch { setAgentOnline(false); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [setAgentOnline]);

  const handleLogout = () => {
    localStorage.removeItem("financeai_auth");
    router.replace("/login");
  };

  return (
    <header className="h-11 bg-white border-b border-[#E2E8F0] flex items-center px-5 gap-3 shrink-0">
      {/* Agent status */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${agentOnline ? "bg-emerald-500" : "bg-red-400"}`} />
        <span className="text-xs text-[#64748B]">Agent {agentOnline ? "connecté" : "hors ligne"}</span>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      {unread.length > 0 && (
        <div className="flex items-center gap-2">
          {unread.slice(0, 2).map((n) => (
            <div key={n.id} className="flex items-center gap-1.5 bg-[#FFF7ED] border border-orange-200 text-orange-700 text-[11px] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span className="truncate max-w-[180px]">{n.task_name}: {n.message}</span>
              <button onClick={() => markRead.mutate(n.id)} className="ml-1 text-orange-400 hover:text-orange-600">✕</button>
            </div>
          ))}
          {unread.length > 2 && (
            <span className="text-[11px] text-[#94A3B8]">+{unread.length - 2}</span>
          )}
        </div>
      )}

      <span className="text-xs text-[#94A3B8]">
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
      </span>

      {/* User + logout */}
      <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-3 ml-1">
        <div className="w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
          <span className="text-[#2563EB] text-[11px] font-bold uppercase">{username.slice(0, 2)}</span>
        </div>
        <span className="text-xs font-medium text-[#374151]">{username}</span>
        <button
          onClick={handleLogout}
          title="Se déconnecter"
          className="text-[#94A3B8] hover:text-red-500 transition-colors ml-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
