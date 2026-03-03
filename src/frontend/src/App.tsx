import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { VoiceButton } from "./components/VoiceButton";
import { useActor } from "./hooks/useActor";
import { VoiceAssistantProvider } from "./hooks/useVoiceAssistant";
import { DietPage } from "./pages/DietPage";
import { FirstAidPage } from "./pages/FirstAidPage";
import { HomePage } from "./pages/HomePage";
import { SOSPage } from "./pages/SOSPage";
import { ServicesPage } from "./pages/ServicesPage";
import { WorkoutsPage } from "./pages/WorkoutsPage";

export type AppPage =
  | "/"
  | "/sos"
  | "/diet"
  | "/first-aid"
  | "/workouts"
  | "/services";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>("/");
  const { actor } = useActor();

  // Initialize backend data on first load
  useEffect(() => {
    if (actor) {
      actor.initialize().catch(() => {
        // Initialization errors are non-critical, silently ignore
      });
    }
  }, [actor]);

  const navigate = (path: string) => {
    setCurrentPage(path as AppPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "/":
        return <HomePage navigate={navigate} />;
      case "/sos":
        return <SOSPage />;
      case "/diet":
        return <DietPage />;
      case "/first-aid":
        return <FirstAidPage />;
      case "/workouts":
        return <WorkoutsPage />;
      case "/services":
        return <ServicesPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <VoiceAssistantProvider onNavigate={navigate}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header currentPage={currentPage} navigate={navigate} />
        <main className="flex-1 pb-24 pt-16">{renderPage()}</main>
        <BottomNav currentPage={currentPage} navigate={navigate} />
        <VoiceButton />
        <Toaster position="top-center" richColors />
      </div>
    </VoiceAssistantProvider>
  );
}

export default function App() {
  return <AppContent />;
}
