import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { generateReading, seedReadings, type Reading } from "./aqi";

const MAX_HISTORY = 200;

interface MonitoringStats {
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  avgTemperature: number;
  avgHumidity: number;
}

interface MonitoringContextValue {
  readings: Reading[];
  latest: Reading | null;
  live: boolean;
  setLive: (v: boolean) => void;
  refresh: () => void;
  stats: MonitoringStats;
}

const MonitoringContext = createContext<MonitoringContextValue | null>(null);

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [readings, setReadings] = useState<Reading[]>(() => seedReadings(20));
  const [live, setLive] = useState(true);
  const liveRef = useRef(live);
  liveRef.current = live;

  const push = useCallback(() => {
    setReadings((prev) => {
      const next = [...prev, generateReading()];
      return next.slice(-MAX_HISTORY);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (liveRef.current) push();
    }, 5000);
    return () => clearInterval(interval);
  }, [push]);

  const stats = useMemo<MonitoringStats>(() => {
    if (readings.length === 0) {
      return { avgAqi: 0, maxAqi: 0, minAqi: 0, avgTemperature: 0, avgHumidity: 0 };
    }
    const aqis = readings.map((r) => r.aqi);
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    return {
      avgAqi: Math.round(avg(aqis)),
      maxAqi: Math.max(...aqis),
      minAqi: Math.min(...aqis),
      avgTemperature: Number(avg(readings.map((r) => r.temperature)).toFixed(1)),
      avgHumidity: Math.round(avg(readings.map((r) => r.humidity))),
    };
  }, [readings]);

  const value = useMemo<MonitoringContextValue>(
    () => ({
      readings,
      latest: readings[readings.length - 1] ?? null,
      live,
      setLive,
      refresh: push,
      stats,
    }),
    [readings, live, push, stats],
  );

  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>;
}

export function useMonitoring() {
  const ctx = useContext(MonitoringContext);
  if (!ctx) throw new Error("useMonitoring must be used within MonitoringProvider");
  return ctx;
}