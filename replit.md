# Shree Calculator Hub

A comprehensive web-based calculator suite built with React 19, TypeScript, and Vite.

## Overview

This is a feature-rich calculator application offering tools across multiple categories:
- **Financial**: EMI, SIP, GST, Income Tax calculators
- **Health**: BMI, BMR, Calorie calculators
- **Utilities**: Unit Converter, Currency Converter (live rates), Crypto Converter

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: Google Gemini AI (`@google/genai`)

## Project Structure

```
/
├── index.html          # SPA entry point
├── vite.config.ts      # Vite configuration (port 5000, all hosts allowed)
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript config
└── src/
    ├── main.tsx        # React bootstrap
    ├── App.tsx         # Main app component (all calculator logic)
    └── index.css       # Global styles + Tailwind directives
```

## Development

```bash
npm install
npm run dev        # Starts dev server on port 5000
npm run build      # Build for production (output: dist/)
npm run lint       # TypeScript type checking
```

## Environment Variables

- `GEMINI_API_KEY` — Required for Google Gemini AI features. Set via Replit Secrets.

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `dist`
