import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Droplets,
  Factory,
  Gauge,
  ShieldCheck,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";

import { MapPin } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { formatDate, formatTime, getAqiCategory } from "@/lib/aqi";
import { useMonitoring } from "@/lib/monitoring-context";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { latest, stats, city, setCity, cities } = useMonitoring();
  if (!latest) return null;
  const category = getAqiCategory(latest.aqi);
  const pct = Math.min(100, (latest.aqi / 350) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Air Quality Dashboard
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Current City:{" "}
            <span className="font-semibold text-foreground">{city}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Last Updated · {formatDate(latest.timestamp)} · {formatTime(latest.timestamp)}
          </p>
        </div>
        <div className="min-w-[200px]">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Select City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-card-foreground outline-none transition focus:ring-2 focus:ring-ring"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AQI Hero */}
      <div className="animate-fade-up grid gap-5 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white shadow-card lg:col-span-2">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-white/80">Air Quality Index</p>
              <p className="mt-1 text-6xl font-black leading-none">{latest.aqi}</p>
              <span
                className="mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {category.label}
              </span>
            </div>
            <div className="relative grid h-32 w-32 place-items-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 327} 327`}
                  style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
              </svg>
              <span className="absolute text-lg font-bold">{Math.round(pct)}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-sm font-bold text-card-foreground">Air Quality Status</h2>
          </div>
          <p className="mt-3 text-2xl font-extrabold" style={{ color: category.color }}>
            {category.label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">AQI range {category.range}</p>
          <p className="mt-3 text-sm text-muted-foreground">{category.tips[0]}</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="PM2.5" value={latest.pm25} unit="µg/m³" icon={Wind} accent="#0ea5e9" index={0} />
        <MetricCard label="PM10" value={latest.pm10} unit="µg/m³" icon={Factory} accent="#6366f1" index={1} />
        <MetricCard label="Temperature" value={latest.temperature} unit="°C" icon={Thermometer} accent="#f97316" index={2} />
        <MetricCard label="Humidity" value={latest.humidity} unit="%" icon={Droplets} accent="#06b6d4" index={3} />
        <MetricCard label="CO₂ Concentration" value={latest.co2} unit="ppm" icon={Gauge} accent="#16a34a" index={4} />
        <MetricCard label="AQI Value" value={latest.aqi} icon={Gauge} accent={category.color} index={5} />
        <MetricCard label="Last Updated" value={formatTime(latest.timestamp)} icon={Clock} accent="#8b5cf6" index={6} />
        <MetricCard label="Status" value={category.label} icon={ShieldCheck} accent={category.color} index={7} />
      </div>

      {/* Statistics */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricCard label="Average AQI" value={stats.avgAqi} icon={Gauge} accent="#0ea5e9" />
          <MetricCard label="Highest AQI" value={stats.maxAqi} icon={TrendingUp} accent="#dc2626" />
          <MetricCard label="Lowest AQI" value={stats.minAqi} icon={TrendingDown} accent="#16a34a" />
          <MetricCard label="Avg Temperature" value={stats.avgTemperature} unit="°C" icon={Thermometer} accent="#f97316" />
          <MetricCard label="Avg Humidity" value={stats.avgHumidity} unit="%" icon={Droplets} accent="#06b6d4" />
        </div>
      </div>
    </div>
  );
}