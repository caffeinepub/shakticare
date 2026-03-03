import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface VoiceAssistantContextType {
  isActive: boolean;
  toggle: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
  isSpeaking: boolean;
}

const VoiceAssistantContext = createContext<
  VoiceAssistantContextType | undefined
>(undefined);

type NavigateCallback = (path: string) => void;

interface VoiceAssistantProviderProps {
  children: ReactNode;
  onNavigate?: NavigateCallback;
}

export function VoiceAssistantProvider({
  children,
  onNavigate,
}: VoiceAssistantProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const isSupported =
    typeof window !== "undefined" &&
    ("speechSynthesis" in window || "SpeechSynthesis" in window);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionAPI =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();

      if (command.includes("go to sos") || command.includes("emergency")) {
        speak("Going to SOS Emergency");
        onNavigate?.("/sos");
      } else if (command.includes("go to diet") || command.includes("diet")) {
        speak("Going to Health and Diet");
        onNavigate?.("/diet");
      } else if (
        command.includes("go to first aid") ||
        command.includes("first aid")
      ) {
        speak("Going to First Aid");
        onNavigate?.("/first-aid");
      } else if (
        command.includes("go to workout") ||
        command.includes("workout")
      ) {
        speak("Going to Workouts");
        onNavigate?.("/workouts");
      } else if (
        command.includes("go to services") ||
        command.includes("services") ||
        command.includes("hospital")
      ) {
        speak("Going to Local Services");
        onNavigate?.("/services");
      } else if (command.includes("go home") || command.includes("home")) {
        speak("Going to Home");
        onNavigate?.("/");
      }
    };

    recognition.onerror = () => {
      // Silently handle recognition errors
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speak, onNavigate]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (!isSupported) {
      toast.error("Voice assistant is not supported on this browser.");
      return;
    }

    if (isActive) {
      stopSpeaking();
      stopListening();
      setIsActive(false);
      toast.info("Voice assistant turned off.");
    } else {
      setIsActive(true);
      speak(
        "Voice assistant activated. You can say go to SOS, go to diet, go to first aid, go to workouts, go to services, or go home.",
      );
      startListening();
      toast.success("Voice assistant turned on!");
    }
  }, [
    isActive,
    isSupported,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  ]);

  return (
    <VoiceAssistantContext.Provider
      value={{ isActive, toggle, speak, stopSpeaking, isSupported, isSpeaking }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error(
      "useVoiceAssistant must be used within VoiceAssistantProvider",
    );
  }
  return context;
}
