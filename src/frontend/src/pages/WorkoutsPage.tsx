import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Loader2, Plus, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ThozhiWorkoutNote } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddWorkoutNote,
  useWorkoutNotes,
  useWorkouts,
} from "../hooks/useQueries";
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

// ─── Static Pregnancy Workout Entries ────────────────────────────────────────

const STATIC_PREGNANCY_WORKOUTS = [
  {
    id: "static-p-1",
    title: "🚶‍♀️ 1. Walking – Best & Safest Exercise",
    duration: "15–30 minutes daily",
    difficulty: "Easy",
    description: [
      "→ Walk at a comfortable pace",
      "→ Improves blood circulation",
      "→ Reduces swelling",
      "→ Helps control weight",
    ],
  },
  {
    id: "static-p-2",
    title: "🧘‍♀️ 2. Prenatal Yoga",
    duration: "15–20 minutes",
    difficulty: "Easy",
    description: [
      "→ Gentle stretches only",
      "→ Reduces back pain",
      "→ Improves flexibility",
      "→ Helps relaxation",
      "",
      "Simple poses:",
      "→ Cat–Cow stretch",
      "→ Butterfly pose",
      "→ Child's pose (with support)",
    ],
  },
  {
    id: "static-p-3",
    title: "🧍 3. Pelvic Tilts – For Back Pain Relief",
    duration: "10 repetitions",
    difficulty: "Easy",
    description: [
      "→ Stand against a wall or on hands & knees",
      "→ Strengthens lower back",
      "→ Reduces pregnancy back pain",
    ],
  },
  {
    id: "static-p-4",
    title: "💪 4. Kegel Exercises – Pelvic Floor Strength",
    duration: "10–15 reps, 3 times daily",
    difficulty: "Easy",
    description: [
      "→ Tighten pelvic muscles for 5 seconds, then relax",
      "→ Helps during labor",
      "→ Prevents urine leakage",
    ],
  },
  {
    id: "static-p-5",
    title: "🪑 5. Seated Leg Raises",
    duration: "10 times each leg",
    difficulty: "Easy",
    description: [
      "→ Sit on a chair",
      "→ Lift one leg slowly, hold for 5 seconds",
      "→ 10 times each leg",
      "→ Improves circulation",
      "→ Strengthens thighs",
    ],
  },
  {
    id: "static-p-6",
    title: "🧱 6. Wall Push-Ups",
    duration: "10–15 repetitions",
    difficulty: "Easy",
    description: [
      "→ Stand facing a wall",
      "→ Do 10–15 slow push-ups",
      "→ Strengthens arms and shoulders",
      "→ Safe alternative to floor push-ups",
    ],
  },
  {
    id: "static-p-7",
    title: "🌬 7. Deep Breathing Exercises",
    duration: "5–10 minutes",
    difficulty: "Easy",
    description: [
      "→ Sit comfortably",
      "→ Inhale slowly through nose",
      "→ Exhale slowly through mouth",
      "→ Reduces stress",
      "→ Helps in labor breathing",
    ],
  },
  {
    id: "static-p-8",
    title: "🚫 Exercises to Avoid During Pregnancy",
    duration: "Reference",
    difficulty: "Beginner",
    description: [
      "→ Heavy weight lifting",
      "→ Jumping exercises",
      "→ Lying flat on back (after first trimester)",
      "→ High-intensity workouts",
      "→ Exercises that cause dizziness or pain",
    ],
  },
  {
    id: "static-p-9",
    title: "💧 Safety Tips for Exercise",
    duration: "Reference",
    difficulty: "Beginner",
    description: [
      "→ Drink plenty of water",
      "→ Wear comfortable clothes",
      "→ Stop if feeling pain, dizziness, or bleeding",
      "→ Exercise 3–5 days per week",
    ],
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
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");

  const { isLoginSuccess, identity } = useInternetIdentity();
  const isLoggedIn = isLoginSuccess && !!identity;
  const { isActive, speak } = useVoiceAssistant();

  const { data: entries, isLoading } = useWorkouts(activeTab);
  const { data: workoutNotes } = useWorkoutNotes(activeTab);
  const addNoteMutation = useAddWorkoutNote();

  const activeCategory = categories.find((c) => c.value === activeTab)!;

  const notes: ThozhiWorkoutNote[] = workoutNotes ?? [];

  // For pregnancy tab, use static entries; for others, use backend entries
  const isPregnancyTab = activeTab === "pregnancy";

  useEffect(() => {
    if (isActive) {
      speak(
        `Workouts page. Showing ${activeTab.replace("_", " ")} exercises. These are safe and gentle exercises designed specifically for women. You can add your own workout notes by tapping the Add Note button when logged in.`,
      );
    }
  }, [isActive, speak, activeTab]);

  const handleAddNote = async () => {
    if (!noteTitle.trim() || !noteDescription.trim()) {
      toast.error("Please fill in both title and description.");
      return;
    }
    try {
      await addNoteMutation.mutateAsync({
        category: activeTab,
        title: noteTitle,
        description: noteDescription,
      });
      toast.success("Note added successfully!");
      setNoteTitle("");
      setNoteDescription("");
      setAddNoteOpen(false);
    } catch {
      toast.error("Failed to add note. Please try again.");
    }
  };

  const hasBackendContent = entries && entries.length > 0;
  const hasStaticContent = isPregnancyTab;
  const hasContent = hasStaticContent || hasBackendContent || notes.length > 0;

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

      {/* Pregnancy section heading */}
      {isPregnancyTab && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
          <h3 className="font-semibold text-sm text-amber-900 text-center">
            🌸 PREGNANCY WOMEN'S WORKOUT GUIDE
          </h3>
          <p className="text-xs text-amber-700 text-center mt-0.5">
            Safe & gentle exercises for expecting mothers
          </p>
        </div>
      )}

      {/* Safety Note */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3">
        <p className="text-xs text-primary font-medium text-center">
          💡 Always consult your doctor before starting a new exercise routine
        </p>
      </div>

      {/* Add Note Button — logged-in users on any tab */}
      {isLoggedIn && (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setAddNoteOpen(true)}
            className="rounded-full gap-1.5 text-xs"
            data-ocid="workouts.add_note_button"
          >
            <Plus className="h-3 w-3" />
            Add Note
          </Button>
        </div>
      )}

      {/* Workout Cards */}
      {!isPregnancyTab && isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : hasContent ? (
        <div className="space-y-3">
          {/* Static pregnancy workout entries */}
          {isPregnancyTab &&
            STATIC_PREGNANCY_WORKOUTS.map((workout, index) => (
              <Card
                key={workout.id}
                className="border-border shadow-sm hover:shadow-md transition-all"
                data-ocid={`workouts.entry.item.${index + 1}`}
              >
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold text-foreground leading-tight flex-1">
                      {workout.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 ${getDifficultyColor(workout.difficulty)}`}
                        variant="outline"
                      >
                        <Zap className="h-2.5 w-2.5 mr-0.5 inline" />
                        {workout.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 pt-0 space-y-2">
                  <div className="space-y-0.5">
                    {workout.description.map((line, li) =>
                      line === "" ? (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static content
                        <div key={li} className="h-1" />
                      ) : (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static content
                        <p
                          key={li}
                          className="text-xs text-muted-foreground leading-relaxed"
                        >
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                  {workout.duration !== "Reference" && (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Clock className="h-3 w-3" />
                      {workout.duration}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

          {/* Backend workout entries (period_relief, general, or any future seeded entries) */}
          {!isPregnancyTab &&
            entries?.map((entry, index) => (
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

          {/* User-added notes — all tabs */}
          {notes.map((note, index) => (
            <Card
              key={note.id.toString()}
              className="border-border shadow-sm hover:shadow-md transition-all"
              data-ocid={`workouts.note.item.${index + 1}`}
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold text-foreground leading-tight flex-1">
                    {note.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 border-teal-300 bg-teal-50 text-teal-700 flex-shrink-0"
                  >
                    📝 My Note
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {note.description}
                </p>
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
            {isLoggedIn
              ? "You can add your own notes above."
              : "Workout data will be available after initialization"}
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

      {/* Add Note Dialog */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent
          className="max-w-sm rounded-2xl"
          data-ocid="workouts.add_note.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-primary">
              Add Personal Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-sm">Title</Label>
              <Input
                placeholder="e.g., My Morning Yoga Routine"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="rounded-xl"
                data-ocid="workouts.note_title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea
                placeholder="Describe the workout, steps, or any tips..."
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                className="rounded-xl min-h-[100px]"
                data-ocid="workouts.note_description.textarea"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => setAddNoteOpen(false)}
              className="flex-1 rounded-xl"
              data-ocid="workouts.add_note.cancel_button"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              disabled={addNoteMutation.isPending}
              className="flex-1 rounded-xl"
              data-ocid="workouts.add_note.submit_button"
            >
              {addNoteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
