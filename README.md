# Dr. Shahidur's Portfolio — Frontend

This is the frontend for Dr. Shahidur Rahman Khan’s portfolio, built as a modern Next.js app with a strong focus on content-driven pages, responsive design, and a smooth developer experience.

## What this project does

- Renders a professional portfolio site with a hero section, specialties, about section, testimonials, and CTAs
- Supports article and research content with listing pages and detail pages
- Includes appointment booking and contact form flows
- Provides search across site content with interactive filtering
- Enables light/dark theming with persisted user preference
- Uses desktop-only 3D hero content to preserve mobile performance

## Why it is built this way

- `src/app` is the central route layer, so pages are easy to add and maintain
- `src/components` contains reusable UI sections and presentation logic
- `src/providers` isolates theme, query client, and reCAPTCHA behavior
- `src/lib/api` is the API integration layer for backend data
- The app balances server-rendered metadata, static content, and client-side interactivity

## Key features

- Responsive layout and accessible navigation
- Theme switcher with system mode support
- Animated page transitions and UI motion using Framer Motion
- API-driven content fetching through shared client wrappers
- Global toast notifications with Sonner
- Cookie consent, analytics tracking, and WhatsApp support built into the shell

## Tech stack

- Next.js App Router (Next 16)
- React 19 + TypeScript
- Tailwind CSS v4
- @tanstack/react-query for client-side data caching
- framer-motion for animation
- three.js for desktop hero visualization
- zustand for lightweight UI state
- Biome for linting and formatting

## Main folders

- `src/app` — pages, layout, metadata, and route config
- `src/components` — page sections, layout pieces, UI primitives, and shared widgets
- `src/providers` — app-wide providers like theme, query client, and reCAPTCHA
- `src/lib` — API clients, fetch helpers, and utility wrappers
- `src/types` — shared data models and type definitions
- `public` — static images, icons, and public assets

## Run locally

```bash
cd Dr-Shahidur-s-Portfolio-frontend
bun install
bun run dev
```

Then open `http://localhost:3000`.

## Build and preview

```bash
bun run build
bun run start
```

## Useful commands

- `bun run lint` — run Biome checks
- `bun run format` — format files
- `bun run type-check` — run TypeScript type checks
- `bun run test` — run unit & integration tests (Vitest)
- `bun run test:run` — run unit tests once
- `bun run test:coverage` — run unit tests with coverage
- `bun run test:e2e` — run E2E tests (Playwright)
- `bun run test:e2e:ui` — run E2E tests with Playwright UI Runner

## Testing Strategy

This repository includes a two-tiered testing system to ensure stability:

### 1. Unit & Integration Tests (Vitest)
- Covers custom React hooks, Zustand stores, API fetchers, formatting utilities, and UI presentation components.
- Run tests with `bun run test`.

### 2. End-to-End Tests (Playwright)
- Tests high-level user flows on both Desktop Chrome and Mobile Chrome viewports.
- E2E tests cover:
  - **Homepage**: Hero loading, links, and CTAs.
  - **Articles**: Loading lists, category filtering, and reading progress tracking.
  - **Chambers**: Grid display, schedules, hotline/assistant contacts, Google maps location links, and deep-linking to the appointment form.
  - **Appointment Form Wizard**: Step-by-step booking form flows (chamber selection, patient details with Bangladesh phone pattern checks, preferred schedules, and submission).
  - **Contact Page**: Required form fields validation and redirection logic.
- Before running E2E tests for the first time, you must download the local browsers:
  ```bash
  bunx playwright install
  ```
- Run E2E tests: `bun run test:e2e`.
- Run E2E tests in interactive mode: `bun run test:e2e:ui`.

## CI/CD Pipeline

The GitHub Actions CI pipeline runs automatically on every push or PR to tracked branches:
- **Lint & Format**: Biome checks styling rules (`biome ci`).
- **TypeScript**: Validates types without emitting files (`tsc --noEmit`).
- **Unit Tests**: Runs Vitest unit tests with coverage reports.
- **E2E Tests**: Downloads cached Playwright browsers and executes the E2E test suite.
- **Production Build**: Compiles Next.js app (`next build`) to ensure build integrity.

## Notes for reviewers

- `src/app/layout.tsx` sets global app metadata and wraps the app with providers
- The app uses `serverFetch` in `src/lib/fetcher.ts` to keep backend API responses consistent
- Mobile views avoid loading the Three.js hero viewer to improve phone performance
- `next.config.ts` includes remote image domains and `allowedDevOrigins` for remote device testing

## Environment

Use `.env.local` for local development when needed.

Common variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

## Contribution guidance

- Add route UI in `src/app`
- Keep reusable UI in `src/components`
- Add shared state or helpers in `src/hooks` and `src/lib`
- Keep provider behavior inside `src/providers`

---
