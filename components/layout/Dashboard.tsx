"use client";
import { SidebarNav } from "./SidebarNav";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ArtifactPanel } from "@/components/results/ArtifactPanel";
import { useAppStore } from "@/store/useAppStore";
import { useResults } from "@/hooks/useResults";

export function Dashboard() {
  const { activeTaskId, lastResultId } = useAppStore();
  const { data: results } = useResults();

  // Artifact panel appears only when there is at least one result or a task is running
  const showArtifact = activeTaskId !== null || (results && results.length > 0);

  return (
    <div className="flex flex-1 overflow-hidden h-full bg-[#F8FAFC]">

      {/* ── Left : Conversation sidebar ── */}
      <SidebarNav />

      {/* ── Center : Chat ── */}
      <main className={`flex-1 min-w-0 flex flex-col overflow-hidden ${showArtifact ? "border-r border-[#E2E8F0]" : ""}`}>
        <ChatPanel />
      </main>

      {/* ── Right : Artifact panel (only when results exist or task running) ── */}
      {showArtifact && (
        <aside className="w-[480px] shrink-0 bg-white flex flex-col overflow-hidden">
          <ArtifactPanel />
        </aside>
      )}

    </div>
  );
}
