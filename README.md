# SmartFarmer SKACE

SmartFarmer SKACE is a production-minded agritech web app for Zambian farmers. It combines crop records, livestock management, storage oversight, farm activity logs, weather-aware guidance, and market visibility in one platform that is designed to evolve into a fuller farmer decision-support system.

## Pitch Summary

SmartFarmer SKACE helps farmers move from scattered notes and reactive decisions toward one guided operating workflow. The current version is strongest as a farm operations MVP:

- Record crop, livestock, storage, and farm logbook data in a structured way.
- Surface recommendations, field guide references, market signals, and starter playbooks.
- Give novice farmers a clearer view of what to watch and what to do next.
- Provide a modular codebase that can support richer disease intelligence, forecasting, and multilingual coaching over time.

## What The Product Does Today

- Authenticated dashboard with protected routes and server-led shell loading
- Crop management with field size, soil, growth stage, health, disease, pest, yield, and revenue tracking
- Livestock management with feed, water, vaccination, production, and health details
- Storage management with quantity, value, quality, expiry, and storage condition tracking
- Farm logbook for activities, weather, labor, expense, harvest, and observations
- Dashboard overview with recommendations, market pulse, crop distribution, field guide entries, and recent logs
- Analytics view for user stats, revenue, production, and progress indicators
- Profile/settings flow aligned to the live database schema

## Current Readiness

This project is much closer to production quality than a prototype, but it is best described honestly as a production-minded MVP.

Already improved:

- Backend routes now use shared helpers, validation, and clearer error handling.
- Dashboard access is properly guarded.
- The app is aligned to the real Supabase schema rather than placeholder fields.
- Frontend forms support create, edit, and delete flows across the main operational modules.
- Public pages and product copy are now more coherent for demos and pitching.

Still to do before calling it fully production-ready:

- Install and enforce ESLint in the workspace
- Add automated tests and CI checks
- Introduce generated Supabase database types
- Expand recommendations beyond rules into deeper disease and seasonal intelligence
- Integrate external weather and market data providers

## Architecture

The app now follows clearer separation of concerns:

- `app/`: Next.js App Router pages, layouts, and API routes
- `components/`: UI building blocks plus dashboard and marketing sections
- `lib/repositories/`: database access and query composition
- `lib/services/`: business logic for dashboard and advisory behavior
- `lib/api/`: route helpers and response/error handling
- `lib/auth/`: server-side auth/session helpers
- `lib/content/`: structured copy/content for the public marketing surfaces
- `lib/types/`: schema-aligned TypeScript models

This structure makes the codebase easier to extend without spreading business logic across pages and components.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth + PostgreSQL
- Recharts
- shadcn/ui
- Zod

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create an `.env` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If you deploy publicly, also set the site URL used by metadata and auth redirects:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

### 3. Run the app

```bash
npm run dev
```

## Verification Scripts

```bash
npm run typecheck
npm run build
```

Note: `npm run lint` is defined, but the workspace currently does not include the `eslint` package yet.

## Database Notes

The app expects the Supabase schema represented by the SQL scripts in `scripts/`. Important tables include:

- `profiles`
- `crops`
- `livestock`
- `storage`
- `farm_logs`
- `recommendations`
- `notifications`
- `user_stats`
- `weather_data`
- `market_prices`
- `disease_pest_library`
- `achievement_definitions`
- `achievements`

Run the SQL setup in Supabase before using the dashboard features.

## Product Direction

The long-term vision is to make SmartFarmer SKACE a more complete farmer success platform, especially for newer farmers. The next major upgrades should focus on:

- richer disease diagnosis and treatment workflows
- localized weather integrations
- stronger trend and seasonal pattern analysis from real historical logs
- multilingual onboarding and education
- testing, observability, and release automation

## Author

Created by Samuel Kaoma.
