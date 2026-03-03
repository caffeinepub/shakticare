import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

export function VoiceButton() {
  const { isActive, toggle, isSpeaking } = useVoiceAssistant();

  return (
    <button
      type="button"
      onClick={toggle}
      data-ocid="voice.toggle_button"
      title={isActive ? "Turn off voice assistant" : "Turn on voice assistant"}
      className={cn(
        "fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center transition-all duration-300",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
        isActive
          ? "bg-primary text-primary-foreground voice-active-glow focus-visible:ring-primary"
          : "bg-card text-primary border-2 border-primary/30 hover:bg-primary/10 focus-visible:ring-primary/50",
      )}
      aria-label={
        isActive
          ? "Voice assistant is ON — click to turn off"
          : "Voice assistant is OFF — click to turn on"
      }
      aria-pressed={isActive}
    >
      {isActive ? (
        <Volume2
          className={cn(
            "h-6 w-6 transition-all",
            isSpeaking && "animate-pulse",
          )}
        />
      ) : (
        <VolumeX className="h-6 w-6" />
      )}
      {/* Status dot */}
      <span
        className={cn(
          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card transition-all",
          isActive ? "bg-green-500" : "bg-muted-foreground/40",
        )}
      />
    </button>
  );
}
