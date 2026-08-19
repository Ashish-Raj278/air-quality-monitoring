# AirSense — Air Quality Monitoring Dashboard

[![Live demo](https://img.shields.io/badge/Live%20demo-Open%20AirSense-16a34a?style=flat-square)](https://air-quality-monitoring.lovable.app)

AirSense is a responsive air-quality monitoring dashboard that makes environmental readings easy to understand. It presents simulated air-quality data for major Indian cities, including AQI, particulate matter, temperature, humidity, and CO₂ concentration.

**[Open the live demo](https://air-quality-monitoring.lovable.app)**

> This is a front-end demonstration project. Readings are generated in the browser to simulate sensor data; it does not connect to a live air-quality API or physical sensors.

## Features

- City dashboard for Bengaluru, Delhi, Mumbai, Chennai, and Kolkata
- Current AQI with health category, status guidance, and summary statistics
- PM2.5, PM10, temperature, humidity, and CO₂ metrics
- Live simulation that refreshes every five seconds, with pause/resume and manual refresh controls
- Trend charts for AQI, particulate matter, temperature, and humidity
- Searchable, filterable, sortable historical readings with CSV export
- AQI-category health recommendations that update with the current reading
- Dark mode, responsive navigation, and a mobile-friendly layout
- Demo sign-in flow with optional browser-session persistence

## Tech Stack

- React 19 and TypeScript
- Vite and TanStack Start / TanStack Router
- Tailwind CSS 4
- Recharts and Chart.js
- Radix UI primitives and Lucide icons

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Installation

```bash
git clone https://github.com/Ashish-Raj278/air-quality-monitoring.git
cd air-quality-monitoring
npm install
npm run dev
```

The development server prints the local URL in the terminal (normally `http://localhost:5173`).

### Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format the codebase with Prettier. |

## How the Demo Works

The app uses predefined city profiles and generates realistic, randomized readings in the browser. Switching cities rebuilds the 30-day historical dataset for that city. The live reading updates every five seconds while simulation is enabled.

The sign-in form is for the demo interface only. It validates an email address and a password of at least four or more characters, then stores only the email in local or session storage when requested. No account service or authentication backend is used.

## Project Structure

```text
src/
├── components/       # Dashboard UI, charts, login, navigation, and UI primitives
├── lib/
│   ├── aqi.ts        # AQI categories, city profiles, simulated readings, and CSV export
│   ├── auth.tsx      # Client-side demo authentication state
│   └── monitoring-context.tsx  # City, live-reading, and history state
├── routes/           # Dashboard, live monitoring, history, recommendations, and about pages
└── styles.css        # Global styles and theme tokens
```

## Deployment

The project is deployed with Lovable at [air-quality-monitoring.lovable.app](https://air-quality-monitoring.lovable.app). Build the app with `npm run build` before deploying to another static or compatible hosting provider.

## License

No license has been specified for this repository. Add a license file before distributing or reusing the project under explicit terms.
