"use client";
import { useState } from "react";
import { useResults } from "@/hooks/useResults";
import { useTasks } from "@/hooks/useTasks";
import { useAppStore } from "@/store/useAppStore";
import { ProgressBar } from "./ProgressBar";
import { LogFeed } from "./LogFeed";
import { formatDate, formatDuration, TASK_ICONS } from "@/lib/utils";
import type { TaskResult } from "@/types";

export function ArtifactPanel() {
  const { data: results } = useResults();
  const { data: tasks } = useTasks();
  const { activeTaskId, lastResultId } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const taskMap = Object.fromEntries((tasks || []).map((t) => [t.id, t]));

  const activeResult =
    results?.find((r) => r.id === (lastResultId ?? selectedId)) ??
    results?.find((r) => r.id === selectedId) ??
    (results && results.length > 0 ? results[0] : null);

  const isRunning = !!activeTaskId;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-11 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span className="text-sm font-semibold text-[#0F172A]">Résultats</span>
          {results && results.length > 0 && (
            <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-1.5 py-0.5 rounded-full font-semibold">
              {results.length}
            </span>
          )}
        </div>
        {activeResult && (
          <span className="text-[11px] text-[#94A3B8]">{formatDate(activeResult.created_at)}</span>
        )}
      </div>

      {/* Progress + Logs while running */}
      {isRunning && (
        <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-4 py-3 shrink-0">
          <ProgressBar />
          <LogFeed />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Result list (left mini-nav) */}
        {results && results.length > 1 && (
          <div className="w-36 shrink-0 border-r border-[#E2E8F0] overflow-y-auto bg-[#F8FAFC]">
            {results.map((r) => {
              const task = taskMap[r.task_id];
              const isActive = r.id === activeResult?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left px-3 py-2.5 border-b border-[#F1F5F9] transition-colors hover:bg-white ${
                    isActive ? "bg-white border-l-2 border-l-[#2563EB]" : ""
                  }`}
                >
                  <p className="text-base leading-none mb-1">{TASK_ICONS[task?.task_type ?? ""] || "📋"}</p>
                  <p className="text-[11px] font-medium text-[#0F172A] line-clamp-2 leading-tight">
                    {task?.name ?? "Analyse"}
                  </p>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">{formatDate(r.created_at)}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Artifact content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {activeResult ? (
            <ArtifactContent result={activeResult} taskName={taskMap[activeResult.task_id]?.name} />
          ) : isRunning ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-[#94A3B8]">
              <div className="w-8 h-8 border-2 border-[#BFDBFE] border-t-[#2563EB] rounded-full animate-spin" />
              <p className="text-[13px]">Traitement en cours...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ArtifactContent({ result, taskName }: { result: TaskResult; taskName?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full animate-slideIn">
      {/* Artifact header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC] shrink-0">
        <div>
          <p className="text-xs font-semibold text-[#0F172A]">{taskName ?? "Analyse"}</p>
          <p className="text-[10px] text-[#64748B]">
            {formatDuration(result.duration)} · {result.triggered_by === "auto" ? "Automatique" : "Manuel"}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Copié
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              Copier
            </>
          )}
        </button>
      </div>

      {/* Artifact body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <pre className="text-[13px] text-[#1E293B] leading-7 whitespace-pre-wrap font-[inherit]">
          {result.content}
        </pre>
      </div>
    </div>
  );
}
