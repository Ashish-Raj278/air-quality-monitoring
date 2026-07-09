import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { AQI_CATEGORIES, getAqiCategory } from "@/lib/aqi";
import { useMonitoring } from "@/lib/monitoring-context";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations — AirSense" },
      { name: "description", content: "Health recommendations that adapt automatically to the current air quality index." },
    ],
  }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const { latest } = useMonitoring();
  if (!latest) return null;
  const current = getAqiCategory(latest.aqi);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Air Quality Recommendations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Guidance updates automatically as air quality changes.
        </p>
      </div>

      <div
        className="animate-fade-up rounded-2xl border p-6 shadow-card"
        style={{ backgroundColor: current.bg, borderColor: current.color }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ backgroundColor: current.color, color: "white" }}>
              <ShieldAlert className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current status</p>
              <p className="text-2xl font-extrabold" style={{ color: current.color }}>
                {current.label}
              </p>
            </div>
          </div>
          <span className="text-4xl font-black" style={{ color: current.color }}>
            AQI {latest.aqi}
          </span>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {current.tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: current.color }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">All Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AQI_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className={`card-hover rounded-2xl border bg-card p-5 shadow-card ${
                cat.label === current.label ? "ring-2" : "border-border"
              }`}
              style={cat.label === current.label ? { ["--tw-ring-color" as string]: cat.color } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: cat.bg, color: cat.color }}>
                  {cat.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{cat.range}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {cat.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: cat.color }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}