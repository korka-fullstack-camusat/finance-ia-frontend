"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("financeai_auth");
      if (!raw) { router.replace("/login"); return; }
      const { at } = JSON.parse(raw);
      // Session expires after 8 hours
      if (Date.now() - at > 8 * 60 * 60 * 1000) {
        localStorage.removeItem("financeai_auth");
        router.replace("/login");
        return;
      }
      setReady(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <div className="w-5 h-5 border-2 border-[#BFDBFE] border-t-[#2563EB] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
