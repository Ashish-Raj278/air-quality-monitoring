import { createFileRoute } from "@tanstack/react-router";
import { Activity, Factory, HeartPulse, LineChart, ShieldCheck, Wind } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AirSense Air Quality Monitoring" },
      { name: "description", content: "Learn about AQI, PM2.5, PM10, why air quality monitoring matters and the health effects of pollution." },
    ],
  }),
  component: AboutPage,
});

const sections = [
  {
    icon: Activity,
    title: "What is AQI?",
    body: "The Air Quality Index (AQI) is a standardized scale from 0 to 500+ that summarizes how polluted the air is and what associated health effects might be. Lower values mean cleaner air; higher values indicate greater health concern.",
  },
  {
    icon: Wind,
    title: "What is PM2.5?",
    body: "PM2.5 refers to fine particulate matter with a diameter of 2.5 micrometers or less. These particles penetrate deep into the lungs and bloodstream, making them one of the most harmful air pollutants.",
  },
  {
    icon: Factory,
    title: "What is PM10?",
    body: "PM10 are coarse particles up to 10 micrometers in diameter, such as dust, pollen and mold. They can irritate the eyes, nose and throat and aggravate respiratory conditions.",
  },
  {
    icon: ShieldCheck,
    title: "Why monitor air quality?",
    body: "Continuous monitoring helps individuals and communities make informed decisions — when to exercise outdoors, ventilate homes, or take protective measures — reducing exposure to harmful pollutants.",
  },
  {
    icon: HeartPulse,
    title: "Health effects of poor air quality",
    body: "Prolonged exposure to polluted air can cause asthma, bronchitis, cardiovascular disease and reduced lung function. Vulnerable groups include children, the elderly and people with existing conditions.",
  },
  {
    icon: LineChart,
    title: "Benefits of continuous monitoring",
    body: "Real-time data enables early warnings, trend analysis and evidence-based policy. It empowers people to protect their health and supports cleaner, more sustainable environments.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl gradient-accent p-8 text-white shadow-card">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">About AirSense</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          AirSense is a smart air quality monitoring system that visualizes environmental data in
          real time. This demonstration uses simulated sensor data to showcase a professional
          monitoring platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <div
            key={s.title}
            className="card-hover animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-white">
              <s.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-base font-bold text-card-foreground">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}