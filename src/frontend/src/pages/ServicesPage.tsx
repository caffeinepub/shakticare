import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalServices } from "../hooks/useQueries";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

type ServiceFilter = "all" | "hospital" | "health_center" | "police";

const filters: {
  value: ServiceFilter;
  label: string;
  emoji: string;
  ocid: string;
  apiType: string;
}[] = [
  {
    value: "all",
    label: "All",
    emoji: "📍",
    ocid: "services.all_tab",
    apiType: "all",
  },
  {
    value: "hospital",
    label: "Hospitals",
    emoji: "🏥",
    ocid: "services.hospital_tab",
    apiType: "hospital",
  },
  {
    value: "health_center",
    label: "Health Centers",
    emoji: "🏨",
    ocid: "services.health_center_tab",
    apiType: "health_center",
  },
  {
    value: "police",
    label: "Police",
    emoji: "🚔",
    ocid: "services.police_tab",
    apiType: "police",
  },
];

const serviceColors: Record<string, string> = {
  hospital: "bg-red-50 border-red-200",
  health_center: "bg-blue-50 border-blue-200",
  police: "bg-indigo-50 border-indigo-200",
  default: "bg-card border-border",
};

const serviceBadge: Record<string, string> = {
  hospital: "bg-red-100 text-red-800",
  health_center: "bg-blue-100 text-blue-800",
  police: "bg-indigo-100 text-indigo-800",
  default: "bg-primary/10 text-primary",
};

const serviceEmoji: Record<string, string> = {
  hospital: "🏥",
  health_center: "🏨",
  police: "🚔",
  default: "📍",
};

function getServiceStyle(type: string) {
  const t = type.toLowerCase();
  return {
    color: serviceColors[t] || serviceColors.default,
    badge: serviceBadge[t] || serviceBadge.default,
    emoji: serviceEmoji[t] || serviceEmoji.default,
  };
}

export function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>("all");
  const { isActive, speak } = useVoiceAssistant();

  const apiType = filters.find((f) => f.value === activeFilter)!.apiType;
  const { data: services, isLoading } = useLocalServices(apiType);

  useEffect(() => {
    if (isActive) {
      speak(
        "Local Services page. You can find nearby hospitals, health centers, and police stations in Tamil Nadu. Each listing has a tap to call button.",
      );
    }
  }, [isActive, speak]);

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display text-xl font-bold text-foreground">
          Local Services
        </h2>
        <p className="text-sm text-muted-foreground">
          Hospitals, health centres & police in Tamil Nadu
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map(({ value, label, emoji, ocid }) => (
          <button
            type="button"
            key={value}
            onClick={() => setActiveFilter(value)}
            data-ocid={ocid}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : services && services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service, index) => {
            const { color, badge, emoji } = getServiceStyle(service.type);
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${service.name} ${service.address} ${service.district} Tamil Nadu`)}`;
            return (
              <Card
                key={service.id.toString()}
                className={`border shadow-sm hover:shadow-md transition-all ${color}`}
                data-ocid={`services.item.${index + 1}`}
              >
                <CardContent className="py-4 px-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{emoji}</span>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-foreground leading-tight">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 border-0 ${badge}`}
                          >
                            {service.type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            📍 {service.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                    <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-primary" />
                    {service.address}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${service.phone}`}
                      data-ocid={`services.call_button.${index + 1}`}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors flex-1 justify-center"
                    >
                      <Phone className="h-3 w-3" />
                      {service.phone}
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Map
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div
          className="text-center py-12 space-y-3"
          data-ocid="services.entries.empty_state"
        >
          <span className="text-4xl">📍</span>
          <p className="text-sm font-medium text-foreground">
            No services found for this filter
          </p>
          <p className="text-xs text-muted-foreground">
            Service data will be available after initialization
          </p>
        </div>
      )}

      {/* Emergency Numbers Reference */}
      <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
        <CardContent className="py-3 px-4">
          <h4 className="font-semibold text-xs text-destructive mb-2 flex items-center gap-1.5">
            🆘 Quick Emergency Dial
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Police", num: "100" },
              { label: "Ambulance", num: "108" },
              { label: "Helpline", num: "181" },
            ].map(({ label, num }) => (
              <a
                key={num}
                href={`tel:${num}`}
                className="flex flex-col items-center p-2 bg-card rounded-xl border border-border text-center hover:bg-accent transition-colors"
              >
                <span className="font-bold text-sm text-primary">{num}</span>
                <span className="text-[10px] text-muted-foreground">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
