"use client";
import { useNotifications, useMarkRead } from "@/hooks/useNotifications";
import { formatDate } from "@/lib/utils";

export function NotificationList() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();

  const unread = (notifications || []).filter((n) => !n.is_read);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
          Alertes
        </h2>
        {unread.length > 0 && (
          <span className="text-[10px] bg-[#7c6ff7]/20 text-[#7c6ff7] px-1.5 py-0.5 rounded font-mono">
            {unread.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5">
        {isLoading && (
          <div className="space-y-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#1c1c22] rounded animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && unread.length === 0 && (
          <p className="text-[11px] text-gray-600 font-mono text-center py-3">
            Aucune alerte
          </p>
        )}

        {unread.map((notif) => (
          <div
            key={notif.id}
            className="bg-[#1c1c22] border border-white/5 rounded p-2 animate-fadeIn"
          >
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-[#7c6ff7] truncate">
                  {notif.task_name}
                </p>
                <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">
                  {notif.message}
                </p>
                <p className="text-[9px] text-gray-600 font-mono mt-0.5">
                  {formatDate(notif.created_at)}
                </p>
              </div>
              <button
                onClick={() => markRead.mutate(notif.id)}
                className="text-gray-600 hover:text-gray-400 shrink-0 text-xs transition-colors ml-1"
                title="Marquer comme lu"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
