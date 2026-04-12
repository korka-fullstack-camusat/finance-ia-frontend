"use client";
import { useAppStore } from "@/store/useAppStore";

export function ProgressBar() {
  const { activeTaskId, progress } = useAppStore();

  if (!activeTaskId) return null;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
        <span>Exécution en cours...</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-[#1c1c22] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#7c6ff7] to-purple-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
