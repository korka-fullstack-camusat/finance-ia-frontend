"use client";
import { TaskList } from "@/components/tasks/TaskList";
import { FileUpload } from "@/components/files/FileUpload";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { NotificationList } from "@/components/notifications/NotificationList";
import { ChatPanel } from "@/components/chat/ChatPanel";

export function Dashboard() {
  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left column — Tasks + Files */}
      <aside className="w-60 shrink-0 bg-[#17171c] border-r border-white/5 flex flex-col p-3 gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          <h2 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2">
            Tâches
          </h2>
          <TaskList />
        </div>
        <div className="shrink-0">
          <FileUpload />
        </div>
      </aside>

      {/* Center column — Results */}
      <main className="flex-1 min-w-0 p-4 overflow-hidden flex flex-col">
        <ResultsPanel />
      </main>

      {/* Right column — Notifications + Chat */}
      <aside className="w-72 shrink-0 bg-[#17171c] border-l border-white/5 flex flex-col p-3 gap-3 overflow-hidden">
        <div className="h-48 shrink-0 overflow-hidden">
          <NotificationList />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatPanel />
        </div>
      </aside>
    </div>
  );
}
