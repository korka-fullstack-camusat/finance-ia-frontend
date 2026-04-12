"use client";
import { useState } from "react";
import type { Task, TaskFrequency } from "@/types";
import { TaskBadge } from "./TaskBadge";
import { useToggleTask, useUpdateFrequency } from "@/hooks/useTasks";
import { useTaskRunner } from "@/hooks/useTaskRunner";
import { useAppStore } from "@/store/useAppStore";
import { TASK_ICONS, FREQUENCY_LABELS, formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const toggle = useToggleTask();
  const updateFreq = useUpdateFrequency();
  const { runTask } = useTaskRunner();
  const activeTaskId = useAppStore((s) => s.activeTaskId);
  const isRunning = activeTaskId === task.id || task.status === "running";

  const handleFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFreq.mutate({ id: task.id, frequency: e.target.value as TaskFrequency });
  };

  const statusColor: Record<string, string> = {
    idle: "text-gray-500",
    running: "text-yellow-400 animate-pulse",
    success: "text-green-400",
    error: "text-red-400",
  };

  return (
    <div className="bg-[#1c1c22] border border-white/5 rounded-lg p-3 flex flex-col gap-2 hover:border-[#7c6ff7]/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{TASK_ICONS[task.task_type] || "📋"}</span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white truncate font-[Syne,sans-serif]">
              {task.name}
            </p>
            <p className={`text-[10px] font-mono mt-0.5 ${statusColor[task.status]}`}>
              {task.status.toUpperCase()}
            </p>
          </div>
        </div>
        <TaskBadge isAuto={task.is_auto} />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.frequency}
          onChange={handleFrequency}
          className="text-[11px] bg-[#0d0d10] text-gray-300 border border-white/10 rounded px-1.5 py-0.5 font-mono flex-1"
        >
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>

        <button
          onClick={() => toggle.mutate(task.id)}
          className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors ${
            task.is_auto
              ? "border-green-700 text-green-400 hover:bg-green-900/30"
              : "border-purple-700 text-purple-400 hover:bg-purple-900/30"
          }`}
        >
          {task.is_auto ? "→ Manuel" : "→ Auto"}
        </button>
      </div>

      <button
        onClick={() => runTask(task.id)}
        disabled={isRunning}
        className={`w-full text-[11px] py-1.5 rounded font-mono font-semibold transition-all ${
          isRunning
            ? "bg-yellow-900/20 text-yellow-400 cursor-not-allowed"
            : "bg-[#7c6ff7]/20 text-[#7c6ff7] border border-[#7c6ff7]/30 hover:bg-[#7c6ff7]/30"
        }`}
      >
        {isRunning ? "En cours..." : "▶ Lancer"}
      </button>

      {task.last_run && (
        <p className="text-[10px] text-gray-600 font-mono">
          Dernier : {formatDate(task.last_run)}
        </p>
      )}
    </div>
  );
}
