import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Dumbbell,
  Heart,
  HeartHandshake,
  MapPin,
  Salad,
} from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

interface HomePageProps {
  navigate: (path: string) => void;
}

const quickActions = [
  {
    path: "/sos",
    icon: AlertTriangle,
    label: "SOS Emergency",
    description: "Call police & emergency contacts",
    color: "bg-destructive/10 border-destructive/20 text-destructive",
    iconColor: "text-destructive",
    urgent: true,
  },
  {
    path: "/diet",
    icon: Salad,
    label: "Health & Diet",
    description: "Nutrition guides for pregnancy & wellness",
    color: "bg-accent border-border",
    iconColor: "text-primary",
  },
  {
    path: "/first-aid",
    icon: HeartHandshake,
    label: "First Aid",
    description: "Emergency first aid steps",
    color: "bg-accent border-border",
    iconColor: "text-primary",
  },
  {
    path: "/workouts",
    icon: Dumbbell,
    label: "Workouts",
    description: "Safe exercises for all stages",
    color: "bg-accent border-border",
    iconColor: "text-primary",
  },
  {
    path: "/services",
    icon: MapPin,
    label: "Local Services",
    description: "Hospitals, health centres & police",
    color: "bg-accent border-border",
    iconColor: "text-primary",
  },
];

const healthTips = [
  "💧 Drink 8-10 glasses of water daily",
  "🌙 Get 7-8 hours of sleep every night",
  "🏃 30 minutes of gentle exercise daily",
  "🥗 Eat plenty of leafy greens and fruits",
  "🧘 Practice deep breathing for stress relief",
  "👩‍⚕️ Regular health check-ups are important",
];

export function HomePage({ navigate }: HomePageProps) {
  const { isLoginSuccess, identity, login } = useInternetIdentity();
  const isLoggedIn = isLoginSuccess && !!identity;
  const { isActive, speak } = useVoiceAssistant();

  useEffect(() => {
    if (isActive) {
      speak(
        "Welcome to Thozhi. Your health and safety companion. You can access SOS Emergency, Health and Diet, First Aid, Workouts, and Local Services from the navigation menu.",
      );
    }
  }, [isActive, speak]);

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/shakticare-hero-banner.dim_800x300.jpg"
          alt="Thozhi — Your Health & Safety Companion"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent flex items-center px-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-white leading-tight drop-shadow-sm">
              Thozhi
            </h2>
            <p className="text-white/90 text-sm font-medium mt-0.5 drop-shadow-sm">
              Your Health & Safety Companion
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Heart className="h-3 w-3 text-white fill-white" />
              <span className="text-white/80 text-xs">
                Built for every woman's journey
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome / Auth Section */}
      {isLoggedIn ? (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 text-primary fill-primary/30" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">
                Welcome back! 💐
              </p>
              <p className="text-xs text-muted-foreground">
                Stay safe and healthy today.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent shadow-sm">
          <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm text-foreground">
                Save your emergency contacts
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in to personalize your experience
              </p>
            </div>
            <Button
              size="sm"
              onClick={login}
              className="rounded-full text-xs shrink-0"
              data-ocid="auth.login_button"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <section>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 px-1">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map(
            ({
              path,
              icon: Icon,
              label,
              description,
              color,
              iconColor,
              urgent,
            }) => (
              <button
                type="button"
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border text-left",
                  "transition-all duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]",
                  color,
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    urgent ? "bg-destructive/15" : "bg-primary/10",
                  )}
                >
                  <Icon className={cn("h-6 w-6", iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-semibold text-sm",
                      urgent ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {description}
                  </p>
                </div>
                <div className={cn("text-lg", urgent && "animate-pulse")}>
                  {urgent ? "🆘" : "→"}
                </div>
              </button>
            ),
          )}
        </div>
      </section>

      {/* Health Tips */}
      <section>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 px-1">
          Daily Health Tips
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {healthTips.map((tip) => (
            <div
              key={tip}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm text-sm text-foreground"
            >
              {tip}
            </div>
          ))}
        </div>
      </section>

      {/* Helpline Numbers */}
      <section>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 px-1">
          Important Helpline Numbers
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Police", number: "100", emoji: "🚔" },
            { label: "Ambulance", number: "108", emoji: "🚑" },
            { label: "Women's Helpline", number: "181", emoji: "👩" },
            { label: "Child Helpline", number: "1098", emoji: "👶" },
            { label: "Fire", number: "101", emoji: "🔥" },
            { label: "Disaster", number: "1070", emoji: "⚠️" },
          ].map(({ label, number, emoji }) => (
            <a
              key={number}
              href={`tel:${number}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:bg-accent hover:border-primary/30 transition-all shadow-sm"
            >
              <span className="text-xl">{emoji}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-sm font-bold text-primary">{number}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pt-2 pb-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <Heart className="inline h-3 w-3 text-primary fill-primary/40" />{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
