import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { formatTime, type Reading } from "@/lib/aqi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface TrendChartProps {
  readings: Reading[];
  dataKey: keyof Pick<Reading, "aqi" | "pm25" | "pm10" | "temperature" | "humidity">;
  label: string;
  color: string;
  unit?: string;
}

export function TrendChart({ readings, dataKey, label, color, unit }: TrendChartProps) {
  const last = readings.slice(-20);
  const labels = last.map((r) => formatTime(r.timestamp));

  const data = {
    labels,
    datasets: [
      {
        label,
        data: last.map((r) => r[dataKey] as number),
        borderColor: color,
        backgroundColor: `${color}22`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y ?? 0}${unit ? ` ${unit}` : ""}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 6, color: "#94a3b8", font: { size: 10 } },
      },
      y: {
        grid: { color: "rgba(148,163,184,0.15)" },
        ticks: { color: "#94a3b8", font: { size: 10 } },
      },
    },
  };

  return (
    <div className="h-56">
      <Line data={data} options={options} />
    </div>
  );
}