import { TopBar } from "@/components/layout/TopBar";
import { Dashboard } from "@/components/layout/Dashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        <TopBar />
        <Dashboard />
      </div>
    </AuthGuard>
  );
}
