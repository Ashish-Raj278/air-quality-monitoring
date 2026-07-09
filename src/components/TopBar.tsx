import { Bell, LogOut, Menu, Moon, RefreshCw, Sun } from "lucide-react";

import { getAqiCategory } from "@/lib/aqi";
import { useAuth } from "@/lib/auth";
import { useMonitoring } from "@/lib/monitoring-context";
import { useTheme } from "@/lib/theme";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { latest, refresh, live, setLive } = useMonitoring();
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const category = latest ? getAqiCategory(latest.aqi) : null;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg sm:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 items-center gap-2">
        <span className={`relative flex h-2.5 w-2.5 ${live ? "live-dot rounded-full" : ""}`}>
          <span
            className={`h-2.5 w-2.5 rounded-full ${live ? "bg-primary" : "bg-muted-foreground"}`}
          />
        </span>
        <span className="hidden truncate text-sm font-medium text-muted-foreground sm:inline">
          {live ? "Live simulation running" : "Simulation paused"}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {category && (
          <span
            className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex"
            style={{ backgroundColor: category.bg, color: category.color }}
          >
            AQI {latest?.aqi} · {category.label}
          </span>
        )}
        <button
          onClick={() => setLive(!live)}
          className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted"
          aria-label="Toggle live"
          title={live ? "Pause live" : "Resume live"}
        >
          <Bell className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={refresh}
          className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted"
          aria-label="Refresh"
          title="Refresh reading"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={toggle}
          className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-muted"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}