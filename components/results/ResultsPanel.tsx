"use client";
import { useResults } from "@/hooks/useResults";
import { useTasks } from "@/hooks/useTasks";
import { ProgressBar } from "./ProgressBar";
import { LogFeed } from "./LogFeed";
import { ResultBlock } from "./ResultBlock";

export function ResultsPanel() {
  const { data: results, isLoading } = useResults();
  const { data: tasks } = useTasks();

  const taskMap = Object.fromEntries((tasks || []).map((t) => [t.id, t.name]));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <ProgressBar />
        <LogFeed />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
            Résultats d'analyse
          </h2>
          {results && (
            <span className="text-[10px] font-mono text-gray-600">{results.length} résultat(s)</span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#1c1c22] rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && results?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
            <span className="text-3xl mb-2">📊</span>
            <p className="text-xs font-mono">Aucun résultat. Lancez une analyse.</p>
          </div>
        )}

        {(results || []).map((result) => (
          <ResultBlock
            key={result.id}
            result={result}
            taskName={taskMap[result.task_id]}
          />
        ))}
      </div>
    </div>
  );
}
