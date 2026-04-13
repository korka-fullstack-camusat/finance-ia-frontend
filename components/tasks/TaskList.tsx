"use client";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-[#F1F5F9] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-xs p-3 bg-red-50 rounded-xl border border-red-200">
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
