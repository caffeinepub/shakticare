import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Dumbbell,
  HeartHandshake,
  Home,
  MapPin,
  Salad,
} from "lucide-react";
import type { AppPage } from "../App";

interface BottomNavProps {
  currentPage: AppPage;
  navigate: (path: string) => void;
}

const navItems = [
  { path: "/", icon: Home, label: "Home", ocid: "nav.home_tab" },
  {
    path: "/sos",
    icon: AlertTriangle,
    label: "SOS",
    ocid: "nav.sos_tab",
    sos: true,
  },
  { path: "/diet", icon: Salad, label: "Diet", ocid: "nav.diet_tab" },
  {
    path: "/first-aid",
    icon: HeartHandshake,
    label: "First Aid",
    ocid: "nav.firstaid_tab",
  },
  {
    path: "/workouts",
    icon: Dumbbell,
    label: "Workouts",
    ocid: "nav.workouts_tab",
  },
  {
    path: "/services",
    icon: MapPin,
    label: "Services",
    ocid: "nav.services_tab",
  },
];

export function BottomNav({ currentPage, navigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border bottom-nav shadow-[0_-4px_24px_oklch(0.52_0.22_15/0.1)]">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label, ocid, sos }) => {
          const isActive = currentPage === path;
          return (
            <button
              type="button"
              key={path}
              onClick={() => navigate(path)}
              data-ocid={ocid}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-0 flex-1",
                sos
                  ? isActive
                    ? "bg-destructive text-destructive-foreground scale-105"
                    : "text-destructive hover:bg-destructive/10"
                  : isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-all",
                  sos && isActive && "animate-bounce",
                  isActive && !sos && "scale-110",
                )}
              >
                <Icon
                  className={cn(
                    "transition-all",
                    sos ? "h-5 w-5" : "h-4 w-4",
                    isActive && !sos && "fill-primary/20",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none truncate",
                  sos && "text-[9px]",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
