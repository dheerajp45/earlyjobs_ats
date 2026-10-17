# System Architecture

## 1. Overview
The **Mini Applicant Tracking System (ATS)** is an end-to-end recruitment management tool built using Next.js App Router, React 19, TypeScript, PostgreSQL, and Prisma ORM.

It replaces fragile disconnected spreadsheets with a unified system providing:
- Candidate profile management with data integrity and unique email constraints.
- A 6-stage structured hiring pipeline (`Applied` → `Screening` → `Interview` → `Offer` → `Hired` / `Rejected`).
- Multi-field database-level candidate search and filtering.
- Visual recruitment metrics and stage distribution charts.

---

## 2. Layer Separation & Boundaries

```
[ Browser UI Layer ]
  ├── App Coordinator (app/page.tsx)
  ├── Pipeline Kanban (components/pipeline/pipeline-board.tsx)
  ├── Candidate Table & Modals (components/candidates/*)
  └── Analytics & Charts (components/dashboard/*)
         │
         │  HTTP / JSON (REST APIs)
         ▼
[ Next.js Server Route Handlers ]
  ├── /api/candidates
  ├── /api/candidates/[id]
  ├── /api/candidates/[id]/stage
  └── /api/dashboard
         │
         │  Validation via Zod Schemas
         ▼
[ Service & Domain Logic Layer ]
  └── lib/services/candidateService.ts
         │
         │  Prisma Client Singleton
         ▼
[ Persistence Layer ]
  └── PostgreSQL Database (Candidates table with stage/position/date indexes)
```

### Boundary Rules
1. **Client Components** never import Prisma or database credentials. All database interactions happen through Next.js API route handlers.
2. **API Route Handlers** do not write direct database queries; they validate incoming HTTP request payloads with Zod and delegate work to `candidateService.ts`.
3. **Service Layer** encapsulates all business rules (e.g., duplicate email prevention, error classification into `ConflictError` vs `NotFoundError`).
4. **Validation Schemas** are shared between client and server for immediate client feedback and server-side validation.
