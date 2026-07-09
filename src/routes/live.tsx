import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Factory, Gauge, Pause, Play, Thermometer, Wind } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { TrendChart } from "@/components/TrendChart";
import { formatTime, getAqiCategory } from "@/lib/aqi";
import { useMonitoring } from "@/lib/monitoring-context";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Monitoring — AirSense" },
      { name: "description", content: "Live simulated environmental readings updating every 5 seconds with trend charts." },
    ],
  }),
  component: LivePage,
});

const charts = [
  { key: "aqi" as const, label: "AQI Trend", color: "#16a34a" },
  { key: "pm25" as const, label: "PM2.5 Trend", color: "#0ea5e9", unit: "µg/m³" },
  { key: "pm10" as const, label: "PM10 Trend", color: "#6366f1", unit: "µg/m³" },
  { key: "temperature" as const, label: "Temperature Trend", color: "#f97316", unit: "°C" },
  { key: "humidity" as const, label: "Humidity Trend", color: "#06b6d4", unit: "%" },
];

function LivePage() {
  const { latest, readings, live, setLive } = useMonitoring();
  if (!latest) return null;
  const category = getAqiCategory(latest.aqi);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Live Monitoring
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            New readings simulated every 5 seconds · Last {formatTime(latest.timestamp)}
          </p>
        </div>
        <button
          onClick={() => setLive(!live)}
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          {live ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {live ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <MetricCard label="AQI" value={latest.aqi} icon={Gauge} accent={category.color} index={0} />
        <MetricCard label="PM2.5" value={latest.pm25} unit="µg/m³" icon={Wind} accent="#0ea5e9" index={1} />
        <MetricCard label="PM10" value={latest.pm10} unit="µg/m³" icon={Factory} accent="#6366f1" index={2} />
        <MetricCard label="Temp" value={latest.temperature} unit="°C" icon={Thermometer} accent="#f97316" index={3} />
        <MetricCard label="Humidity" value={latest.humidity} unit="%" icon={Droplets} accent="#06b6d4" index={4} />
        <MetricCard label="CO₂" value={latest.co2} unit="ppm" icon={Gauge} accent="#16a34a" index={5} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {charts.map((c) => (
          <div key={c.key} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              <h2 className="text-sm font-bold text-card-foreground">{c.label}</h2>
            </div>
            <TrendChart readings={readings} dataKey={c.key} label={c.label} color={c.color} unit={c.unit} />
          </div>
        ))}
      </div>
    </div>
  );
}