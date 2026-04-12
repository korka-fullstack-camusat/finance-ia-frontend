"use client";

interface TaskBadgeProps {
  isAuto: boolean;
}

export function TaskBadge({ isAuto }: TaskBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-widest uppercase
        ${isAuto
          ? "bg-green-900/40 text-green-400 border border-green-700/50"
          : "bg-purple-900/40 text-purple-400 border border-purple-700/50"
        }
      `}
    >
      {isAuto ? "AUTO" : "MANUEL"}
    </span>
  );
}
