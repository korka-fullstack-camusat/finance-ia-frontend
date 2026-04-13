"use client";
import { useNotifications, useMarkRead } from "@/hooks/useNotifications";
import { formatDate } from "@/lib/utils";

const TYPE_STYLE: Record<string, { dot: string; bg: string }> = {
  success: { dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  error:   { dot: "bg-red-400",     bg: "bg-red-50 border-red-200" },
  info:    { dot: "bg-blue-400",    bg: "bg-blue-50 border-blue-200" },
};

export function NotificationList() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();

  const unread = (notifications || []).filter((n) => !n.is_read);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest">
          Alertes
        </h2>
        {unread.length > 0 && (
          <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-1.5 py-0.5 rounded-full font-semibold">
            {unread.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5">
        {isLoading && (
          <div className="space-y-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#F1F5F9] rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && unread.length === 0 && (
          <div className="py-4 text-center">
            <span className="text-lg">🔔</span>
            <p className="text-[11px] text-[#94A3B8] mt-1">Aucune alerte</p>
          </div>
        )}

        {unread.map((notif) => {
          const style = TYPE_STYLE[notif.type ?? "info"] ?? TYPE_STYLE.info;
          return (
            <div
              key={notif.id}
              className={`border rounded-lg p-2 ${style.bg}`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-start gap-1.5 min-w-0 flex-1">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-[#2563EB] truncate">
                      {notif.task_name}
                    </p>
                    <p className="text-[11px] text-[#0F172A] line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-[#94A3B8] mt-0.5">
                      {formatDate(notif.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => markRead.mutate(notif.id)}
                  className="text-[#94A3B8] hover:text-[#64748B] shrink-0 text-xs transition-colors ml-1 mt-0.5"
                  title="Marquer comme lu"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
