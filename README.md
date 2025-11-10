Safari Tour

A Nuxt 4 + Vue 3 application for managing and visualizing safari locations and logs.

## Tech Stack
- Nuxt 4, Vue 3, TypeScript
- Pinia for state management
- MapLibre GL via @indoorequal/vue-maplibre-gl
- Drizzle ORM (+ SQLite/libsql) for data access
- Vee-Validate + Zod for form validation
- Better Auth for authentication
- Tailwind CSS (with DaisyUI)

## Getting Started

### Prerequisites
- Node 18+
- pnpm

### Setup


## Project Structure (high level)
- app/ … application code (pages, components, stores)
- server/ … Nitro server routes and middleware
- lib/ … shared libraries (db, types, constants)
- shared/ … app-wide utilities
- public/ … static assets

## Key Concepts

### Authentication
- server/middleware/auth.ts attaches `event.context.user` if a session exists.
- Use `defineAuthEventHandler` for protected APIs.

### Map
- `useMapStore` controls map points and camera behavior.
- Call `initMap()` from the client-only map component after mount.

### Locations
- `useLocationStore` fetches locations and syncs them to the sidebar and map.
- `GET /api/locations` returns the authenticated user’s locations.

## Conventions
- All times are epoch ms.
- Geographic coordinates use `{ lat, long }`.
- Prefer Zod schemas for validating inputs to APIs and forms.

## Scripts
- `pnpm dev` – start dev server
- `pnpm build` – build for production
- `pnpm preview` – preview production build
