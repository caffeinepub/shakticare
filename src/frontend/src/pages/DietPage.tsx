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
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateDietEntry, useDietEntries } from "../hooks/useQueries";
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

  const { data: entries, isLoading } = useDietEntries(activeTab);
  const createMutation = useCreateDietEntry();

  const activeCategory = categories.find((c) => c.value === activeTab)!;

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
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
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
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.description}
                    </p>
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
              <Label className="text-sm">Description</Label>
              <Textarea
                placeholder="Describe the food, benefits, and how to include it in the diet..."
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
