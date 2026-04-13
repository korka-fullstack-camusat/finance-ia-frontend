"use client";
import type { Task, TaskFrequency } from "@/types";
import { TaskBadge } from "./TaskBadge";
import { useToggleTask, useUpdateFrequency } from "@/hooks/useTasks";
import { useTaskRunner } from "@/hooks/useTaskRunner";
import { useAppStore } from "@/store/useAppStore";
import { TASK_ICONS, formatDate } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  idle:    "bg-slate-300",
  running: "bg-amber-400 animate-pulse",
  success: "bg-emerald-500",
  error:   "bg-red-400",
};

export function TaskCard({ task }: { task: Task }) {
  const toggle = useToggleTask();
  const updateFreq = useUpdateFrequency();
  const { runTask } = useTaskRunner();
  const activeTaskId = useAppStore((s) => s.activeTaskId);
  const isRunning = activeTaskId === task.id || task.status === "running";

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 hover:border-[#2563EB]/30 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{TASK_ICONS[task.task_type] || "📋"}</span>
          <div>
            <p className="text-[12px] font-semibold text-[#0F172A] leading-tight">{task.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[task.status]}`} />
              <span className="text-[10px] text-[#94A3B8]">{task.status}</span>
            </div>
          </div>
        </div>
        <TaskBadge isAuto={task.is_auto} />
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <select
          value={task.frequency}
          onChange={(e) => updateFreq.mutate({ id: task.id, frequency: e.target.value as TaskFrequency })}
          className="flex-1 text-[11px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-2 py-1 focus:outline-none focus:border-[#2563EB]"
        >
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
        <button
          onClick={() => toggle.mutate(task.id)}
          className="text-[10px] px-2 py-1 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors whitespace-nowrap"
        >
          {task.is_auto ? "→ Manuel" : "→ Auto"}
        </button>
      </div>

      <button
        onClick={() => runTask(task.id)}
        disabled={isRunning}
        className={`w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
          isRunning
            ? "bg-amber-50 text-amber-600 border border-amber-200 cursor-not-allowed"
            : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm"
        }`}
      >
        {isRunning ? "En cours..." : "▶ Lancer"}
      </button>
    </div>
  );
}
