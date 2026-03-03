import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useWorkouts } from "../hooks/useQueries";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

type WorkoutCategory = "pregnancy" | "period_relief" | "general";

const categories: {
  value: WorkoutCategory;
  label: string;
  emoji: string;
  ocid: string;
  description: string;
  color: string;
}[] = [
  {
    value: "pregnancy",
    label: "Pregnancy",
    emoji: "🤰",
    ocid: "workouts.pregnancy_tab",
    description: "Safe exercises for expecting mothers",
    color: "bg-amber-50 border-amber-200",
  },
  {
    value: "period_relief",
    label: "Period Relief",
    emoji: "🌸",
    ocid: "workouts.period_tab",
    description: "Gentle exercises to ease cramps",
    color: "bg-rose-50 border-rose-200",
  },
  {
    value: "general",
    label: "General",
    emoji: "🧘",
    ocid: "workouts.general_tab",
    description: "Everyday fitness for women",
    color: "bg-emerald-50 border-emerald-200",
  },
];

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  beginner: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  moderate: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
  advanced: "bg-red-100 text-red-800",
};

function getDifficultyColor(difficulty: string): string {
  return (
    difficultyColor[difficulty.toLowerCase()] || "bg-primary/10 text-primary"
  );
}

export function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState<WorkoutCategory>("pregnancy");
  const { isActive, speak } = useVoiceAssistant();

  const { data: entries, isLoading } = useWorkouts(activeTab);

  const activeCategory = categories.find((c) => c.value === activeTab)!;

  useEffect(() => {
    if (isActive) {
      speak(
        `Workouts page. Showing ${activeTab.replace("_", " ")} exercises. These are safe and gentle exercises designed specifically for women.`,
      );
    }
  }, [isActive, speak, activeTab]);

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display text-xl font-bold text-foreground">
          Workout & Wellness
        </h2>
        <p className="text-sm text-muted-foreground">
          Safe exercises for every stage
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(({ value, label, emoji, ocid }) => (
          <button
            type="button"
            key={value}
            onClick={() => setActiveTab(value)}
            data-ocid={ocid}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Active Category Info */}
      <Card className={`${activeCategory.color} shadow-sm`}>
        <CardContent className="py-3 px-4 flex items-center gap-3">
          <span className="text-3xl">{activeCategory.emoji}</span>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {activeCategory.label} Workouts
            </p>
            <p className="text-xs text-muted-foreground">
              {activeCategory.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Safety Note */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3">
        <p className="text-xs text-primary font-medium text-center">
          💡 Always consult your doctor before starting a new exercise routine
        </p>
      </div>

      {/* Workout Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <Card
              key={entry.id.toString()}
              className="border-border shadow-sm hover:shadow-md transition-all"
              data-ocid={`workouts.entry.item.${index + 1}`}
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold text-foreground leading-tight flex-1">
                    {entry.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge
                      className={`text-[10px] px-2 py-0.5 ${getDifficultyColor(entry.difficulty)}`}
                      variant="outline"
                    >
                      <Zap className="h-2.5 w-2.5 mr-0.5 inline" />
                      {entry.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0 space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Clock className="h-3 w-3" />
                  {entry.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 space-y-3"
          data-ocid="workouts.entries.empty_state"
        >
          <span className="text-4xl">{activeCategory.emoji}</span>
          <p className="text-sm font-medium text-foreground">
            No workouts loaded yet
          </p>
          <p className="text-xs text-muted-foreground">
            Workout data will be available after initialization
          </p>
        </div>
      )}

      {/* Wellness Tips */}
      <Card className="border-primary/20 bg-accent shadow-sm">
        <CardContent className="py-4 px-4">
          <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            🌟 Wellness Reminders
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Always warm up for 5 minutes before exercise</li>
            <li>• Cool down and stretch after each session</li>
            <li>• Stay hydrated — drink water before and after</li>
            <li>• Listen to your body, stop if you feel pain</li>
            <li>• Consistency over intensity — small steps count!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
