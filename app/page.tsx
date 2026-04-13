import { TopBar } from "@/components/layout/TopBar";
import { Dashboard } from "@/components/layout/Dashboard";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      <TopBar />
      <Dashboard />
    </div>
  );
}
