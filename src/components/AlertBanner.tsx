import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getAqiCategory } from "@/lib/aqi";
import { useMonitoring } from "@/lib/monitoring-context";

export function AlertBanner() {
  const { latest } = useMonitoring();
  const [dismissedFor, setDismissedFor] = useState<number | null>(null);

  const aqi = latest?.aqi ?? 0;
  const show = aqi > 150 && dismissedFor !== latest?.timestamp;

  // Re-show banner on each new dangerous reading
  useEffect(() => {
    if (aqi <= 150) setDismissedFor(null);
  }, [aqi]);

  if (!show || !latest) return null;
  const category = getAqiCategory(aqi);

  return (
    <div
      className="animate-fade-up flex items-center gap-3 border-b px-4 py-3 text-sm font-medium sm:px-6"
      style={{ backgroundColor: category.bg, color: category.color }}
    >
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <p className="flex-1">
        <strong>Health Alert:</strong> AQI has reached {aqi} ({category.label}). {category.tips[0]}
      </p>
      <button
        onClick={() => setDismissedFor(latest.timestamp)}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg hover:bg-black/10"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
