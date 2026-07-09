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

import {
  CITIES,
  generateCityHistory,
  generateCityReading,
  type Reading,
} from "./aqi";

interface MonitoringStats {
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  avgTemperature: number;
  avgHumidity: number;
}

interface MonitoringContextValue {
  city: string;
  setCity: (c: string) => void;
  cities: string[];
  readings: Reading[];
  latest: Reading | null;
  live: boolean;
  setLive: (v: boolean) => void;
  refresh: () => void;
  stats: MonitoringStats;
}

const MonitoringContext = createContext<MonitoringContextValue | null>(null);

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<string>(CITIES[0].name);
  const [readings, setReadings] = useState<Reading[]>(() =>
    generateCityHistory(CITIES[0].name),
  );
  const [latest, setLatest] = useState<Reading>(() =>
    generateCityReading(CITIES[0].name),
  );
  const [live, setLive] = useState(true);
  const liveRef = useRef(live);
  liveRef.current = live;
  const cityRef = useRef(city);
  cityRef.current = city;

  // Rebuild all data when the selected city changes.
  useEffect(() => {
    setReadings(generateCityHistory(city));
    setLatest(generateCityReading(city));
  }, [city]);

  const refresh = useCallback(() => {
    setLatest(generateCityReading(cityRef.current));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (liveRef.current) setLatest(generateCityReading(cityRef.current));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      city,
      setCity,
      cities: CITIES.map((c) => c.name),
      readings,
      latest,
      live,
      setLive,
      refresh,
      stats,
    }),
    [city, readings, latest, live, refresh, stats],
  );

  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>;
}

export function useMonitoring() {
  const ctx = useContext(MonitoringContext);
  if (!ctx) throw new Error("useMonitoring must be used within MonitoringProvider");
  return ctx;
}