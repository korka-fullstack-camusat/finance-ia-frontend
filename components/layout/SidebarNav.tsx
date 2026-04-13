"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useTasks } from "@/hooks/useTasks";
import { useTaskRunner } from "@/hooks/useTaskRunner";
import { useNotifications } from "@/hooks/useNotifications";
import { TASK_ICONS } from "@/lib/utils";
import type { ConversationSession } from "@/types";

function groupSessionsByDate(sessions: ConversationSession[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const week = new Date(today);
  week.setDate(week.getDate() - 7);

  const groups: { label: string; items: ConversationSession[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: "Hier", items: [] },
    { label: "7 derniers jours", items: [] },
    { label: "Plus ancien", items: [] },
  ];

  for (const s of sessions) {
    const d = new Date(s.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d >= today) groups[0].items.push(s);
    else if (d >= yesterday) groups[1].items.push(s);
    else if (d >= week) groups[2].items.push(s);
    else groups[3].items.push(s);
  }

  return groups.filter((g) => g.items.length > 0);
}

export function SidebarNav() {
  const { sessions, activeSessionId, createSession, setActiveSession, deleteSession } = useAppStore();
  const [showTasks, setShowTasks] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  const { data: tasks } = useTasks();
  const { runTask } = useTaskRunner();
  const { data: notifications } = useNotifications();
  const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

  const groups = groupSessionsByDate(sessions);

  return (
    <aside className="w-64 shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col h-full overflow-hidden select-none">

      {/* ── Header ── */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 px-1 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="font-semibold text-[#0F172A] text-[15px] tracking-tight">
            Finance<span className="text-[#2563EB]">AI</span>
          </span>
        </div>

        {/* New chat button */}
        <button
          onClick={() => createSession()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouvelle discussion
        </button>
      </div>

      {/* ── Session list ── */}
      <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
        {groups.length === 0 ? (
          <p className="text-[11px] text-[#94A3B8] text-center py-4">Aucune discussion</p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 py-1">
                {group.label}
              </p>
              {group.items.map((s) => (
                <div
                  key={s.id}
                  className="relative group"
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    onClick={() => setActiveSession(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${
                      activeSessionId === s.id
                        ? "bg-white border border-[#E2E8F0] text-[#0F172A] font-medium shadow-sm"
                        : "text-[#475569] hover:bg-white hover:border hover:border-[#E2E8F0] hover:shadow-sm"
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-[#94A3B8]">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span className="truncate flex-1">{s.title}</span>
                  </button>
                  {hovered === s.id && sessions.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-red-400 transition-colors p-1 rounded"
                      title="Supprimer"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Tâches IA ── */}
      <div className="shrink-0 border-t border-[#E2E8F0]">
        <button
          onClick={() => setShowTasks((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hover:bg-[#F1F5F9] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>
            Tâches IA
          </span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform ${showTasks ? "" : "-rotate-90"}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {showTasks && (
          <div className="px-2 pb-2 space-y-0.5">
            {(tasks || []).map((task) => (
              <div key={task.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm hover:border hover:border-[#E2E8F0] transition-all group">
                <span className="text-sm shrink-0">{TASK_ICONS[task.task_type] || "📋"}</span>
                <span className="flex-1 text-[12px] text-[#475569] truncate">{task.name}</span>
                <button
                  onClick={() => runTask(task.id)}
                  disabled={task.status === "running"}
                  className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-semibold transition-colors ${
                    task.status === "running"
                      ? "bg-amber-50 text-amber-500 border border-amber-200"
                      : "opacity-0 group-hover:opacity-100 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#2563EB] hover:text-white"
                  }`}
                >
                  {task.status === "running" ? "…" : "▶"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Notifications count ── */}
      {unreadCount > 0 && (
        <div className="shrink-0 border-t border-[#E2E8F0] px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[12px] text-[#64748B]">{unreadCount} alerte{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}</span>
        </div>
      )}
    </aside>
  );
}
