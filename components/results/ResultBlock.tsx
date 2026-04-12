"use client";
import { useState } from "react";
import type { TaskResult } from "@/types";
import { formatDate, formatDuration } from "@/lib/utils";

interface ResultBlockProps {
  result: TaskResult;
  taskName?: string;
}

export function ResultBlock({ result, taskName }: ResultBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1c1c22] border border-white/5 rounded-lg overflow-hidden animate-fadeIn">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            {taskName && (
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-0.5">
                {taskName}
              </p>
            )}
            <p className="text-[13px] text-white font-semibold line-clamp-1">{result.summary}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <span className="text-[10px] font-mono text-gray-500">
              {formatDuration(result.duration)}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                result.triggered_by === "auto"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-purple-900/30 text-purple-400"
              }`}
            >
              {result.triggered_by === "auto" ? "AUTO" : "MANUEL"}
            </span>
            <span className="text-gray-500 text-xs">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 font-mono mt-1">{formatDate(result.created_at)}</p>
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-3">
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="text-[12px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {result.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
