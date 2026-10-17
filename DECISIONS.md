# Architecture Decision Records (ADRs)

## ADR 01: Next.js App Router Monolith over Separate Express Backend
- **Context**: The ATS requires an API layer and a responsive frontend dashboard.
- **Decision**: Use Next.js App Router Route Handlers (`app/api/*`) instead of maintaining a separate Express server.
- **Rationale**: Eliminates duplicate TypeScript definitions, simplifies deployment to Vercel, eliminates cross-origin resource sharing (CORS) setup, and keeps the project cohesive.

## ADR 02: Pinned Prisma ORM 6.19.3
- **Context**: Prisma 8-alpha/rc release candidate has breaking syntax and compatibility issues with current database engines.
- **Decision**: Pin both `prisma` and `@prisma/client` to stable version `^6.19.3`.
- **Rationale**: Guarantees stable schema compilation, client generation, and zero runtime crashes across both Windows local development and Vercel production deployment.

## ADR 03: Direct Reject Capability in Pipeline Board
- **Context**: Earlier implementations only provided a forward "Advance" button (`ChevronRight`), forcing recruiters to move candidates linearly through Interview and Offer before they could be rejected.
- **Decision**: Added a dedicated red "Reject" button (`XCircle`) on every pipeline card, alongside an inline stage selector dropdown.
- **Rationale**: Real-world hiring requires rejecting candidates at any phase (e.g. failing a screening interview) without requiring them to advance to subsequent stages.

## ADR 04: Vitest over Jest
- **Context**: Modern ESM and Next.js / TypeScript test runner.
- **Decision**: Configure Vitest with `@vitejs/plugin-react`.
- **Rationale**: Native TypeScript support out of the box with zero Babel configuration overhead and faster test runs.
