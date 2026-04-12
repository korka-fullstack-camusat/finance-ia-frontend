"use client";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1c1c22] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-xs font-mono p-3 bg-red-900/10 rounded-lg border border-red-900/30">
        Erreur de connexion au backend
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(tasks || []).map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
