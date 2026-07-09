export interface Reading {
  id: string;
  timestamp: number;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  co2: number;
}

export interface AqiCategory {
  label: string;
  range: string;
  /** tailwind-ready hsl-ish token via inline style color */
  color: string;
  bg: string;
  tips: string[];
}

export const AQI_CATEGORIES: AqiCategory[] = [
  {
    label: "Good",
    range: "0–50",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.12)",
    tips: ["Safe for outdoor activities.", "Fresh air quality — enjoy the outdoors."],
  },
  {
    label: "Moderate",
    range: "51–100",
    color: "#ca8a04",
    bg: "rgba(202,138,4,0.14)",
    tips: [
      "Air quality is acceptable.",
      "Sensitive individuals should reduce prolonged outdoor activity.",
    ],
  },
  {
    label: "Unhealthy for Sensitive Groups",
    range: "101–150",
    color: "#ea580c",
    bg: "rgba(234,88,12,0.14)",
    tips: [
      "Sensitive groups should limit outdoor exertion.",
      "Consider wearing a mask outdoors.",
      "Keep windows closed during peak hours.",
    ],
  },
  {
    label: "Unhealthy",
    range: "151–200",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.14)",
    tips: [
      "Wear a mask outdoors.",
      "Avoid strenuous outdoor exercise.",
      "Keep windows closed if possible.",
    ],
  },
  {
    label: "Very Unhealthy",
    range: "201–300",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.14)",
    tips: ["Stay indoors.", "Use air purifiers.", "Avoid outdoor exposure."],
  },
  {
    label: "Hazardous",
    range: "300+",
    color: "#7f1d1d",
    bg: "rgba(127,29,29,0.16)",
    tips: ["Avoid going outside.", "Follow emergency health precautions.", "Seal indoor spaces."],
  },
];

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return AQI_CATEGORIES[0];
  if (aqi <= 100) return AQI_CATEGORIES[1];
  if (aqi <= 150) return AQI_CATEGORIES[2];
  if (aqi <= 200) return AQI_CATEGORIES[3];
  if (aqi <= 300) return AQI_CATEGORIES[4];
  return AQI_CATEGORIES[5];
}

const rand = (min: number, max: number, decimals = 0) => {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
};

export function generateReading(timestamp = Date.now()): Reading {
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    aqi: rand(40, 220),
    pm25: rand(10, 120),
    pm10: rand(20, 180),
    temperature: rand(22, 36, 1),
    humidity: rand(35, 80),
    co2: rand(400, 1200),
  };
}

export function seedReadings(count = 20): Reading[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) =>
    generateReading(now - (count - 1 - i) * 5000),
  );
}

/* ---- City-based simulation ---- */

export interface CityProfile {
  name: string;
  aqi: number;
  temp: number;
  humidity: number;
}

export const CITIES: CityProfile[] = [
  { name: "Bengaluru", aqi: 68, temp: 26, humidity: 60 },
  { name: "Delhi", aqi: 182, temp: 32, humidity: 45 },
  { name: "Mumbai", aqi: 91, temp: 30, humidity: 72 },
  { name: "Chennai", aqi: 74, temp: 33, humidity: 68 },
  { name: "Kolkata", aqi: 129, temp: 31, humidity: 70 },
];

export type CityName = (typeof CITIES)[number]["name"];

const around = (base: number, pct: number) => base * (1 + (Math.random() * 2 - 1) * pct);

export function generateCityReading(city: string, timestamp = Date.now()): Reading {
  const p = CITIES.find((c) => c.name === city) ?? CITIES[0];
  const aqi = Math.max(5, Math.round(around(p.aqi, 0.18)));
  return {
    id: `${city}-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp,
    aqi,
    pm25: Math.round(aqi * 0.6 * (0.85 + Math.random() * 0.3)),
    pm10: Math.round(aqi * 0.9 * (0.85 + Math.random() * 0.3)),
    temperature: Number(around(p.temp, 0.08).toFixed(1)),
    humidity: Math.round(around(p.humidity, 0.12)),
    co2: Math.round(420 + aqi * 2 + Math.random() * 120),
  };
}

const DAY_MS = 86_400_000;

export function generateCityHistory(city: string, days = 30): Reading[] {
  const now = Date.now();
  return Array.from({ length: days }, (_, i) =>
    generateCityReading(city, now - (days - 1 - i) * DAY_MS),
  );
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function toCsv(readings: Reading[]): string {
  const header = [
    "Timestamp",
    "AQI",
    "PM2.5",
    "PM10",
    "Temperature",
    "Humidity",
    "CO2",
    "Status",
  ].join(",");
  const rows = readings.map((r) =>
    [
      new Date(r.timestamp).toISOString(),
      r.aqi,
      r.pm25,
      r.pm10,
      r.temperature,
      r.humidity,
      r.co2,
      getAqiCategory(r.aqi).label,
    ].join(","),
  );
  return [header, ...rows].join("\n");
}