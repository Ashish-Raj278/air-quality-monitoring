import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  accent: string;
  sub?: string;
  index?: number;
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
  sub,
  index = 0,
}: MetricCardProps) {
  return (
    <div
      className="card-hover animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-card-foreground">
            {value}
            {unit && <span className="ml-1 text-base font-semibold text-muted-foreground">{unit}</span>}
          </p>
          {sub && <p className="mt-1 text-xs font-medium" style={{ color: accent }}>{sub}</p>}
        </div>
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}