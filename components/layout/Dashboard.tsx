"use client";
import { TaskList } from "@/components/tasks/TaskList";
import { FileUpload } from "@/components/files/FileUpload";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ArtifactPanel } from "@/components/results/ArtifactPanel";
import { NotificationList } from "@/components/notifications/NotificationList";

export function Dashboard() {
  return (
    <div className="flex flex-1 overflow-hidden h-full bg-[#F8FAFC]">

      {/* ── Left sidebar : Tasks + Files + Notifications ── */}
      <aside className="w-64 shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col overflow-hidden">
        {/* Tasks */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
            Tâches automatisées
          </p>
          <TaskList />
        </div>

        {/* Files */}
        <div className="border-t border-[#E2E8F0] p-4">
          <FileUpload />
        </div>

        {/* Notifications */}
        <div className="border-t border-[#E2E8F0] p-4 max-h-48 overflow-y-auto">
          <NotificationList />
        </div>
      </aside>

      {/* ── Center : Chat (Claude-style) ── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden border-r border-[#E2E8F0]">
        <ChatPanel />
      </main>

      {/* ── Right : Artifact panel ── */}
      <aside className="w-[480px] shrink-0 bg-white flex flex-col overflow-hidden">
        <ArtifactPanel />
      </aside>

    </div>
  );
}
