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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ThozhiDietEntry } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddDietEntry, useDietEntries } from "../hooks/useQueries";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

type DietCategory = "pregnancy" | "menstrual" | "general";

const categories: {
  value: DietCategory;
  label: string;
  emoji: string;
  ocid: string;
  description: string;
}[] = [
  {
    value: "pregnancy",
    label: "Pregnancy",
    emoji: "🤰",
    ocid: "diet.pregnancy_tab",
    description: "Nutrition guide for expecting mothers",
  },
  {
    value: "menstrual",
    label: "Menstrual",
    emoji: "🌸",
    ocid: "diet.menstrual_tab",
    description: "Diet tips for monthly wellness",
  },
  {
    value: "general",
    label: "General",
    emoji: "🌿",
    ocid: "diet.general_tab",
    description: "Everyday nutrition for women",
  },
];

const categoryColors: Record<DietCategory, string> = {
  pregnancy: "bg-amber-50 border-amber-200",
  menstrual: "bg-rose-50 border-rose-200",
  general: "bg-emerald-50 border-emerald-200",
};

const categoryBadge: Record<DietCategory, string> = {
  pregnancy: "bg-amber-100 text-amber-800",
  menstrual: "bg-rose-100 text-rose-800",
  general: "bg-emerald-100 text-emerald-800",
};

// ─── Static Pregnancy Diet Entries ───────────────────────────────────────────

const STATIC_PREGNANCY_ENTRIES: ThozhiDietEntry[] = [
  {
    id: BigInt(-1),
    title: "🥦 Important Nutrients",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Key nutrients every pregnant woman needs daily:",
      "",
      "• Folic Acid — Prevents birth defects",
      "  ➜ Found in: Spinach, oranges, lentils, fortified cereals",
      "",
      "• Iron — Prevents anemia",
      "  ➜ Found in: Greens, dates, beans, jaggery, lean meat",
      "",
      "• Calcium — Builds baby's bones and teeth",
      "  ➜ Found in: Milk, curd, paneer, almonds, ragi",
      "",
      "• Protein — Helps tissue and muscle growth",
      "  ➜ Found in: Eggs, dal, chicken, nuts, soybeans",
      "",
      "• Omega-3 — Brain and eye development",
      "  ➜ Found in: Walnuts, flax seeds, chia seeds, fatty fish",
      "",
      "• Fiber — Prevents constipation",
      "  ➜ Found in: Fruits, vegetables, whole grains, oats",
    ].join("\n"),
  },
  {
    id: BigInt(-2),
    title: "1️⃣ Folic Acid (Vitamin B9)",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Prevents neural tube defects in baby",
      "Required: 400–600 mcg daily",
      "",
      "Sources:",
      "• Spinach",
      "• Broccoli",
      "• Oranges",
      "• Lentils",
      "• Fortified cereals",
    ].join("\n"),
  },
  {
    id: BigInt(-3),
    title: "2️⃣ Iron",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Prevents anemia and supports oxygen supply",
      "Required: 27 mg daily",
      "",
      "Sources:",
      "• Green leafy vegetables",
      "• Dates",
      "• Beans",
      "• Lean meat",
      "• Jaggery",
      "",
      "👉 Take with Vitamin C (like lemon) for better absorption",
    ].join("\n"),
  },
  {
    id: BigInt(-4),
    title: "3️⃣ Calcium",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Builds baby's bones and teeth",
      "Required: 1000–1200 mg daily",
      "",
      "Sources:",
      "• Milk",
      "• Curd",
      "• Paneer",
      "• Almonds",
      "• Ragi",
    ].join("\n"),
  },
  {
    id: BigInt(-5),
    title: "4️⃣ Protein",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Tissue and muscle development",
      "Required: 70–100 g per day",
      "",
      "Sources:",
      "• Eggs",
      "• Dal",
      "• Chicken",
      "• Fish",
      "• Soybeans",
      "• Nuts",
    ].join("\n"),
  },
  {
    id: BigInt(-6),
    title: "5️⃣ Omega-3 Fatty Acids",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Brain and eye development of baby",
      "",
      "Sources:",
      "• Walnuts",
      "• Flax seeds",
      "• Chia seeds",
      "• Fatty fish",
    ].join("\n"),
  },
  {
    id: BigInt(-7),
    title: "6️⃣ Fiber",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Importance: Prevents constipation during pregnancy",
      "",
      "Sources:",
      "• Whole grains",
      "• Fruits",
      "• Vegetables",
      "• Oats",
    ].join("\n"),
  },
  {
    id: BigInt(-8),
    title: "🌼 1st Trimester Diet (1–3 Months)",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Common Issues: Nausea, vomiting, loss of appetite",
      "",
      "Diet Tips:",
      "✔ Eat small frequent meals",
      "✔ Dry foods like crackers in the morning",
      "✔ Ginger tea helps reduce nausea",
      "✔ Avoid oily and spicy food",
      "",
      "Sample Diet:",
      "• Morning: Warm milk + dry fruits",
      "• Breakfast: Idli / Oats / Whole wheat toast",
      "• Lunch: Rice + Dal + Vegetable curry + Curd",
      "• Evening: Fruits (banana, apple)",
      "• Dinner: Chapati + Vegetable + Protein source",
    ].join("\n"),
  },
  {
    id: BigInt(-9),
    title: "🌺 2nd Trimester Diet (4–6 Months)",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Focus: Rapid baby growth, increased hunger",
      "",
      "Diet Tips:",
      "✔ Increase protein intake",
      "✔ Add iron-rich foods",
      "✔ Drink 2–3 liters of water daily",
      "",
      "Sample Diet:",
      "• Breakfast: Vegetable upma + Milk",
      "• Mid-morning: Fresh fruit juice",
      "• Lunch: Brown rice + Chicken/Fish/Dal + Greens",
      "• Snack: Nuts and seeds",
      "• Dinner: Chapati + Paneer/Vegetables",
    ].join("\n"),
  },
  {
    id: BigInt(-10),
    title: "🌻 3rd Trimester Diet (7–9 Months)",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Focus: Brain development, bone strengthening",
      "",
      "Diet Tips:",
      "✔ Eat calcium-rich foods",
      "✔ Light meals to avoid heartburn",
      "✔ Avoid excess salt",
      "",
      "Sample Diet:",
      "• Breakfast: Ragi porridge + Nuts",
      "• Lunch: Rice + Sambar + Vegetable + Curd",
      "• Evening: Boiled corn / Sprouts",
      "• Dinner: Light chapati + Dal + Vegetable",
    ].join("\n"),
  },
  {
    id: BigInt(-11),
    title: "🚫 Foods to Avoid During Pregnancy",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Avoid these foods throughout pregnancy:",
      "",
      "• Raw or undercooked meat",
      "• Raw eggs",
      "• Unpasteurized milk",
      "• Excess caffeine (coffee, tea)",
      "• Junk and processed foods",
      "• Alcohol and smoking",
      "• Unripe papaya",
      "• Excessive pineapple",
    ].join("\n"),
  },
  {
    id: BigInt(-12),
    title: "💧 Additional Care & Special Indian Tips",
    category: "pregnancy",
    isPreloaded: true,
    description: [
      "Additional Important Measures:",
      "✔ Drink at least 8–10 glasses of water daily",
      "✔ Avoid skipping meals",
      "✔ Take prescribed prenatal supplements",
      "✔ Maintain healthy weight gain (11–16 kg average)",
      "✔ Do light exercise (walking, prenatal yoga) after doctor consultation",
      "✔ Maintain proper hygiene",
      "",
      "Special Care for Indian Pregnant Women:",
      "• Include traditional nutritious foods: Ragi, Moong dal, Coconut water, Khichdi",
      "• Use iron vessels for cooking to increase iron intake",
      "• Avoid unripe papaya and excessive pineapple",
      "",
      "A balanced pregnancy diet should include:",
      "• Carbohydrates (50–60%)",
      "• Protein (20%)",
      "• Healthy fats (20–30%)",
      "• Vitamins & Minerals",
      "",
      "⚠️ Proper nutrition ensures a healthy mother and healthy baby 👶💖",
    ].join("\n"),
  },
];

// ─── Description Renderer ─────────────────────────────────────────────────────

function DescriptionLine({ line }: { line: string }) {
  const trimmed = line.trimStart();
  const indent = line.length - trimmed.length;

  const isBullet =
    trimmed.startsWith("• ") ||
    trimmed.startsWith("➜ ") ||
    trimmed.startsWith("✔ ") ||
    trimmed.startsWith("👉 ") ||
    trimmed.startsWith("⚠️ ") ||
    trimmed.startsWith("- ");

  const isLabel =
    !isBullet &&
    trimmed.length > 0 &&
    (trimmed.endsWith(":") ||
      /^(Importance|Required|Sources|Focus|Common Issues|Sample Diet|Diet Tips|Additional|Special Care|A balanced|Morning|Breakfast|Lunch|Evening|Dinner|Mid-morning|Snack|Night|Avoid these)/i.test(
        trimmed,
      ));

  if (trimmed === "") {
    return <div className="h-1.5" />;
  }

  if (isBullet) {
    return (
      <div
        className="flex gap-2 text-sm text-foreground/80 leading-relaxed"
        style={{ paddingLeft: `${indent * 0.5 + 0.75}rem` }}
      >
        <span className="flex-1">{trimmed}</span>
      </div>
    );
  }

  if (isLabel) {
    return (
      <p
        className="text-xs font-semibold text-foreground/90 uppercase tracking-wide mt-2"
        style={{ paddingLeft: `${indent * 0.5}rem` }}
      >
        {trimmed}
      </p>
    );
  }

  return (
    <p
      className="text-sm text-foreground/80 leading-relaxed"
      style={{ paddingLeft: `${indent * 0.5}rem` }}
    >
      {trimmed}
    </p>
  );
}

function FormattedDescription({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static content, order is stable
        <DescriptionLine key={i} line={line} />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DietPage() {
  const [activeTab, setActiveTab] = useState<DietCategory>("pregnancy");
  const [addOpen, setAddOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DietCategory>("pregnancy");

  const { isLoginSuccess, identity } = useInternetIdentity();
  const isLoggedIn = isLoginSuccess && !!identity;
  const { isActive, speak } = useVoiceAssistant();

  const { data: backendEntries, isLoading } = useDietEntries(activeTab);
  const createMutation = useAddDietEntry();

  const activeCategory = categories.find((c) => c.value === activeTab)!;

  // Merge static pregnancy entries with any user-added backend entries
  const entries: ThozhiDietEntry[] = (() => {
    if (activeTab === "pregnancy") {
      const userEntries = (backendEntries ?? []).filter((e) => !e.isPreloaded);
      return [...STATIC_PREGNANCY_ENTRIES, ...userEntries];
    }
    return backendEntries ?? [];
  })();

  const isShowingContent = activeTab === "pregnancy" ? true : !isLoading;

  useEffect(() => {
    if (isActive) {
      speak(
        `Health and Diet page. Currently showing ${activeTab} diet guide. You can switch between Pregnancy, Menstrual, and General categories.`,
      );
    }
  }, [isActive, speak, activeTab]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description.");
      return;
    }
    try {
      await createMutation.mutateAsync({ category, title, description });
      toast.success("Diet entry added!");
      setTitle("");
      setDescription("");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add entry. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display text-xl font-bold text-foreground">
          Health & Diet Guide
        </h2>
        <p className="text-sm text-muted-foreground">
          Nutrition advice for every stage of life
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
      <Card className={`${categoryColors[activeTab]} shadow-sm`}>
        <CardContent className="py-3 px-4 flex items-center gap-3">
          <span className="text-3xl">{activeCategory.emoji}</span>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {activeCategory.label} Diet Guide
            </p>
            <p className="text-xs text-muted-foreground">
              {activeCategory.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pregnancy section heading */}
      {activeTab === "pregnancy" && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
          <h3 className="font-semibold text-sm text-amber-900 text-center">
            🌟 PREGNANCY WOMEN'S DIET MEASURES
          </h3>
          <p className="text-xs text-amber-700 text-center mt-0.5">
            Complete nutrition guide for a healthy pregnancy
          </p>
        </div>
      )}

      {/* Community note */}
      <p className="text-xs text-muted-foreground text-center px-2">
        👥 Community entries added by users are visible to everyone.
      </p>

      {/* Add Entry Button */}
      {isLoggedIn && (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setCategory(activeTab);
              setAddOpen(true);
            }}
            className="rounded-full gap-1.5 text-xs"
            data-ocid="diet.add_button"
          >
            <Plus className="h-3 w-3" />
            Add Entry
          </Button>
        </div>
      )}

      {/* Entries List */}
      {!isShowingContent && isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const id = entry.id.toString();
            const isExpanded = expandedIds.has(id);
            return (
              <Card
                key={id}
                className="border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
                data-ocid={`diet.entry.item.${index + 1}`}
                onClick={() => toggleExpand(id)}
              >
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-foreground leading-tight">
                        {entry.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`text-[10px] px-2 py-0 ${categoryBadge[activeTab]}`}
                          variant="outline"
                        >
                          {activeCategory.label}
                        </Badge>
                        {entry.isPreloaded && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0 border-primary/30 text-primary"
                          >
                            ✓ Verified
                          </Badge>
                        )}
                        {!entry.isPreloaded && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0 border-rose-300 bg-rose-50 text-rose-700"
                            data-ocid="diet.community_badge"
                          >
                            👥 Community
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pb-4 pt-0">
                    <FormattedDescription text={entry.description} />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div
          className="text-center py-12 space-y-3"
          data-ocid="diet.entries.empty_state"
        >
          <span className="text-4xl">{activeCategory.emoji}</span>
          <p className="text-sm font-medium text-foreground">
            No entries yet for {activeCategory.label}
          </p>
          {isLoggedIn && (
            <Button
              size="sm"
              onClick={() => {
                setCategory(activeTab);
                setAddOpen(true);
              }}
              variant="outline"
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add First Entry
            </Button>
          )}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="max-w-sm rounded-2xl"
          data-ocid="diet.add_entry.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-primary">
              Add Diet Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-sm">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as DietCategory)}
              >
                <SelectTrigger
                  className="rounded-xl"
                  data-ocid="diet.add_category.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(({ value, label, emoji }) => (
                    <SelectItem key={value} value={value}>
                      {emoji} {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Title</Label>
              <Input
                placeholder="e.g., Iron-Rich Foods for Pregnancy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
                data-ocid="diet.add_title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description / Notes</Label>
              <Textarea
                placeholder="Add your notes, food tips, or personal observations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl min-h-[100px]"
                data-ocid="diet.add_description.textarea"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="flex-1 rounded-xl"
              data-ocid="diet.add_entry.cancel_button"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createMutation.isPending}
              className="flex-1 rounded-xl"
              data-ocid="diet.add_entry.submit_button"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
