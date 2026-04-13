"use client";
import { useAppStore } from "@/store/useAppStore";

export function ProgressBar() {
  const { activeTaskId, progress } = useAppStore();
  if (!activeTaskId) return null;

  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] text-[#2563EB] font-medium mb-1">
        <span>Analyse en cours...</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-[#BFDBFE] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
