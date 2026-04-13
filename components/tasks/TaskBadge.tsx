"use client";
export function TaskBadge({ isAuto }: { isAuto: boolean }) {
  return (
    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
      isAuto
        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
        : "bg-blue-50 text-blue-600 border border-blue-200"
    }`}>
      {isAuto ? "Auto" : "Manuel"}
    </span>
  );
}
