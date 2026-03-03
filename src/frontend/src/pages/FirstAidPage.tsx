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
import { ChevronDown, ChevronUp, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateFirstAidEntry,
  useFirstAidEntries,
} from "../hooks/useQueries";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

const situationEmojis: Record<string, string> = {
  burn: "🔥",
  cut: "✂️",
  fainting: "💫",
  pregnancy: "🤰",
  fracture: "🦴",
  choking: "😮",
  bleeding: "🩸",
  allergy: "🌿",
  heatstroke: "☀️",
  default: "🩹",
};

function getSituationEmoji(situation: string): string {
  const lower = situation.toLowerCase();
  for (const [key, emoji] of Object.entries(situationEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return situationEmojis.default;
}

export function FirstAidPage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [situation, setSituation] = useState("");
  const [stepsText, setStepsText] = useState("");

  const { isLoginSuccess, identity } = useInternetIdentity();
  const isLoggedIn = isLoginSuccess && !!identity;
  const { isActive, speak } = useVoiceAssistant();

  const { data: entries, isLoading } = useFirstAidEntries();
  const createMutation = useCreateFirstAidEntry();

  useEffect(() => {
    if (isActive) {
      speak(
        "First Aid page. Here you can find step by step first aid instructions for common emergencies including burns, cuts, fainting, and pregnancy emergencies.",
      );
    }
  }, [isActive, speak]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (!situation.trim() || !stepsText.trim()) {
      toast.error("Please fill in the situation and steps.");
      return;
    }
    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (steps.length === 0) {
      toast.error("Please add at least one step.");
      return;
    }
    try {
      await createMutation.mutateAsync({ situation, steps });
      toast.success("First aid entry added!");
      setSituation("");
      setStepsText("");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add entry. Please try again.");
    }
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-card border-2 border-destructive/20 rounded-2xl p-4 flex items-center gap-4">
        <span className="text-4xl">🩹</span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            First Aid Guide
          </h2>
          <p className="text-sm text-muted-foreground">
            Step-by-step emergency instructions
          </p>
        </div>
        {isLoggedIn && (
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="ml-auto rounded-full gap-1.5 text-xs shrink-0"
            data-ocid="firstaid.add_button"
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        )}
      </div>

      {/* Emergency Notice */}
      <div className="bg-destructive/10 border border-destructive/25 rounded-xl p-3 text-center">
        <p className="text-xs text-destructive font-semibold">
          ⚠️ Always call emergency services (108) first in life-threatening
          situations
        </p>
      </div>

      {/* Entries */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const id = entry.id.toString();
            const isExpanded = expandedIds.has(id);
            const emoji = getSituationEmoji(entry.situation);
            return (
              <Card
                key={id}
                className="border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
                data-ocid={`firstaid.entry.item.${index + 1}`}
                onClick={() => toggleExpand(id)}
              >
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{emoji}</span>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold text-foreground leading-tight truncate">
                          {entry.situation}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 border-primary/25 text-primary"
                          >
                            {entry.steps.length} steps
                          </Badge>
                          {entry.isPreloaded && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-green-300 text-green-700"
                            >
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0">
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
                    <ol className="space-y-2">
                      {entry.steps.map((step, stepIdx) => (
                        <li
                          key={`step-${stepIdx}-${step.slice(0, 10)}`}
                          className="flex gap-3 text-sm text-muted-foreground"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/15 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                            {stepIdx + 1}
                          </span>
                          <span className="pt-0.5 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div
          className="text-center py-12 space-y-3"
          data-ocid="firstaid.entries.empty_state"
        >
          <span className="text-4xl">🩹</span>
          <p className="text-sm font-medium text-foreground">No entries yet</p>
          {isLoggedIn && (
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
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
          data-ocid="firstaid.add_entry.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-primary">
              Add First Aid Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-sm">Situation / Emergency Type</Label>
              <Input
                placeholder="e.g., Burns from hot water"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="rounded-xl"
                data-ocid="firstaid.add_situation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Steps (one per line)</Label>
              <Textarea
                placeholder={
                  "1. Cool the burn with cold water for 10 minutes\n2. Do not use ice or butter\n3. Cover with clean bandage\n4. Call doctor if severe"
                }
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                className="rounded-xl min-h-[140px] text-sm"
                data-ocid="firstaid.add_steps.textarea"
              />
              <p className="text-xs text-muted-foreground">
                Each line will become a separate step
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 flex-row">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="flex-1 rounded-xl"
              data-ocid="firstaid.add_entry.cancel_button"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createMutation.isPending}
              className="flex-1 rounded-xl"
              data-ocid="firstaid.add_entry.submit_button"
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
