# Corb3D - Professional 3D Printing Website

## Overview

Corb3D is a professional 3D printing services website built as a full-stack TypeScript application. It features a landing page showcasing 3D printing services (prototyping, serial production, 3D modeling) with a dark-themed, animated UI, a contact form that saves messages to a PostgreSQL database, and an admin dashboard for managing contact messages. The project follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM.

### Admin Dashboard
- **Route**: `/admin` — login-protected admin area
- **Auth**: Session-based with express-session + connect-pg-simple, username "admin", password from ADMIN_PASSWORD env var
- **Features**: View contact messages, mark as read, delete messages
- **Footer link**: Small "Admin" link in the site footer

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Project Structure
- **`client/`** — React frontend (Vite-powered SPA)
- **`server/`** — Express 5 backend API
- **`shared/`** — Shared TypeScript types and database schema (used by both client and server)
- **`migrations/`** — Drizzle-generated database migrations
- **`script/`** — Build scripts

### Frontend Architecture
- **Framework**: React with TypeScript (no SSR, pure SPA)
- **Bundler**: Vite with HMR in development
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, supports light/dark modes
- **Animations**: Framer Motion for page animations
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod resolvers via `@hookform/resolvers`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with `tsx` for TypeScript execution
- **Framework**: Express 5
- **API Pattern**: All API routes prefixed with `/api`
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Currently uses in-memory storage (`MemStorage`) but designed to be swapped for database-backed storage
- **Dev Server**: Vite dev server integrated as Express middleware in development
- **Production**: Static files served from `dist/public`, built with esbuild for server + Vite for client

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's `pgTable` helpers
- **Validation**: `drizzle-zod` generates Zod schemas from database tables
- **Current Schema**: Users table with `id` (UUID), `username`, and `password`
- **Migrations**: Run via `drizzle-kit push` (uses `DATABASE_URL` env var)
- **Session Store**: `connect-pg-simple` available for PostgreSQL-backed sessions

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware for HMR
- **Production Build**: `npm run build` runs custom `script/build.ts` which:
  - Builds the client with Vite (outputs to `dist/public`)
  - Bundles the server with esbuild (outputs to `dist/index.cjs`)
  - Selectively bundles common server dependencies to reduce cold start times
- **Production Start**: `npm start` runs `node dist/index.cjs`
- **Type Checking**: `npm run check` runs TypeScript compiler
- **Database Push**: `npm run db:push` syncs schema to database

### Key Design Decisions
1. **Shared schema between client and server**: The `shared/` directory contains types and schemas used by both sides, ensuring type safety across the stack
2. **Storage interface abstraction**: The `IStorage` interface allows swapping between in-memory and database storage without changing route handlers
3. **In-memory storage as default**: The app currently uses `MemStorage` — when connecting to a real database, create a `DatabaseStorage` class implementing `IStorage`
4. **Monorepo without workspaces**: Single `package.json` manages all dependencies for simplicity

## External Dependencies

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable
- **Drizzle ORM** for query building and schema management
- **connect-pg-simple** for session storage (available but may not be active)

### Key NPM Packages
- **express** v5 — HTTP server
- **@tanstack/react-query** — Client-side data fetching/caching
- **framer-motion** — Animations
- **wouter** — Client-side routing
- **zod** — Runtime validation
- **drizzle-zod** — Schema-to-validation bridge
- **nanoid** — ID generation
- **date-fns** — Date utilities

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in development
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)

### Google Fonts
- Architects Daughter, DM Sans, Fira Code, Geist Mono — loaded via Google Fonts CDN