import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownUp, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AQI_CATEGORIES, formatDateTime, getAqiCategory, toCsv } from "@/lib/aqi";
import { useMonitoring } from "@/lib/monitoring-context";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historical Data — AirSense" },
      { name: "description", content: "Searchable, filterable history of all air quality readings with CSV export." },
    ],
  }),
  component: HistoryPage,
});

const PAGE_SIZE = 8;

function HistoryPage() {
  const { readings, city } = useMonitoring();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...readings];
    if (status !== "all") rows = rows.filter((r) => getAqiCategory(r.aqi).label === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) =>
          formatDateTime(r.timestamp).toLowerCase().includes(q) ||
          String(r.aqi).includes(q) ||
          getAqiCategory(r.aqi).label.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) => (desc ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));
    return rows;
  }, [readings, status, query, desc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `air-quality-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Historical Data
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last 30 days for {city} · {filtered.length} readings
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search readings…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-card-foreground outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All statuses</option>
          {AQI_CATEGORIES.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setDesc((d) => !d)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
        >
          <ArrowDownUp className="h-4 w-4" /> {desc ? "Newest" : "Oldest"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Timestamp</th>
              <th className="px-4 py-3 font-semibold">AQI</th>
              <th className="px-4 py-3 font-semibold">PM2.5</th>
              <th className="px-4 py-3 font-semibold">PM10</th>
              <th className="px-4 py-3 font-semibold">Temp</th>
              <th className="px-4 py-3 font-semibold">Humidity</th>
              <th className="px-4 py-3 font-semibold">CO₂</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const cat = getAqiCategory(r.aqi);
              return (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDateTime(r.timestamp)}</td>
                  <td className="px-4 py-3 font-bold text-card-foreground">{r.aqi}</td>
                  <td className="px-4 py-3">{r.pm25}</td>
                  <td className="px-4 py-3">{r.pm10}</td>
                  <td className="px-4 py-3">{r.temperature}°C</td>
                  <td className="px-4 py-3">{r.humidity}%</td>
                  <td className="px-4 py-3">{r.co2}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  No readings match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {safePage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-card-foreground disabled:opacity-40 hover:bg-muted"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-card-foreground disabled:opacity-40 hover:bg-muted"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}