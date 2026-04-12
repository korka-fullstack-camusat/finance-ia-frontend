"use client";
import { useEffect } from "react";
import { checkHealth } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useTasks } from "@/hooks/useTasks";

export function TopBar() {
  const { agentOnline, setAgentOnline } = useAppStore();
  const { data: tasks } = useTasks();

  useEffect(() => {
    const check = async () => {
      try {
        await checkHealth();
        setAgentOnline(true);
      } catch {
        setAgentOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [setAgentOnline]);

  // Prochain cycle : trouver la prochaine tâche AUTO
  const nextAutoTask = (tasks || [])
    .filter((t) => t.is_auto)
    .sort((a, b) => {
      if (!a.next_run) return 1;
      if (!b.next_run) return -1;
      return new Date(a.next_run).getTime() - new Date(b.next_run).getTime();
    })[0];

  return (
    <header className="h-11 bg-[#17171c] border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">💹</span>
        <span className="text-white font-bold text-[15px] tracking-tight font-[Syne,sans-serif]">
          Finance<span className="text-[#7c6ff7]">AI</span>
        </span>
      </div>

      <div className="h-4 w-px bg-white/10" />

      {/* Agent status */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            agentOnline ? "bg-green-400 animate-pulse" : "bg-red-500"
          }`}
        />
        <span className="text-[11px] font-mono text-gray-400">
          Agent {agentOnline ? "en ligne" : "hors ligne"}
        </span>
      </div>

      {nextAutoTask && (
        <>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-[11px] font-mono text-gray-500">
            Prochain cycle :{" "}
            <span className="text-gray-300">{nextAutoTask.name}</span>
            {" — "}
            <span className="text-[#7c6ff7]">{nextAutoTask.frequency}</span>
          </div>
        </>
      )}

      <div className="ml-auto text-[11px] font-mono text-gray-600">
        {new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </header>
  );
}
