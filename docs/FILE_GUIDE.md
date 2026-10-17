# File Guide & Architecture Map

This guide documents every core file in the Mini Applicant Tracking System (ATS), its architectural responsibility, its execution environment, and its dependencies.

---

## 1. Directory Tree & Architecture

```
earlyjobs_ai/
├── app/
│   ├── api/
│   │   ├── candidates/
│   │   │   ├── route.ts                 # GET /api/candidates, POST /api/candidates
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts             # GET, PUT, DELETE /api/candidates/:id
│   │   │   │   └── stage/
│   │   │   │       └── route.ts         # PATCH /api/candidates/:id/stage
│   │   └── dashboard/
│   │       └── route.ts                 # GET /api/dashboard
│   ├── globals.css                      # Global Tailwind CSS styles and theme variables
│   ├── layout.tsx                       # Root layout with Geist font and app metadata
│   └── page.tsx                         # Client-side single page app coordinating views
├── components/
│   ├── candidates/
│   │   ├── candidate-detail-modal.tsx   # Inspection dialog for candidate profile & stage
│   │   ├── candidate-filters.tsx        # Search, stage selector, role selector, reset
│   │   ├── candidate-form-modal.tsx     # Add / Edit candidate form with Zod error handling
│   │   ├── candidate-table.tsx          # Tabular candidate list with inline stage dropdown
│   │   └── delete-confirm-modal.tsx     # Confirmation dialog before candidate deletion
│   ├── dashboard/
│   │   ├── metric-cards.tsx             # 4 summary KPI cards (Total, Active, Hired, Roles)
│   │   ├── recent-candidates.tsx        # Quick feed of recently registered candidates
│   │   └── stage-chart.tsx              # Recharts bar chart displaying stage distribution
│   ├── layout/
│   │   ├── header.tsx                   # Top bar with live stats and quick "Add Candidate"
│   │   └── sidebar.tsx                  # Navigation tabs (Dashboard, Candidates, Pipeline)
│   ├── pipeline/
│   │   └── pipeline-board.tsx           # 6-column Kanban board with Reject & Advance
│   └── ui/
│       ├── badge.tsx                    # Color-coded badge for 6 candidate stages
│       └── modal.tsx                    # Accessible dialog component with backdrop blur
├── lib/
│   ├── prisma.ts                        # Global PrismaClient singleton for Next.js
│   ├── utils.ts                         # Tailwind clsx + twMerge utility helper
│   ├── services/
│   │   └── candidateService.ts          # Server-side business logic & database queries
│   └── validations/
│       └── candidate.ts                 # Zod validation schemas and TypeScript types
├── prisma/
│   ├── schema.prisma                    # Prisma data model & PostgreSQL connection
│   └── seed.ts                          # Database seed script with 12 diverse candidates
├── tests/
│   ├── candidateService.test.ts         # Vitest DB integration test suite
│   └── validations.test.ts              # Vitest Zod schema unit test suite
├── .env                                 # Local environment variables (DATABASE_URL)
├── .env.example                         # Committed template for environment variables
├── ARCHITECTURE.md                      # System architecture and layer boundaries
├── DATA_MODEL.md                        # Database schema, enums, indexes, and relations
├── DECISIONS.md                         # Architecture decision records (ADRs)
├── TESTING.md                           # Testing strategy, running tests, and test coverage
└── README.md                            # Main project documentation and setup instructions
```

---

## 2. File Responsibilities

### Core Configuration & Database
- [`prisma/schema.prisma`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/prisma/schema.prisma):
  - **Environment**: Prisma Engine / Migration Tool.
  - **Responsibility**: Declares the `Candidate` entity, `CandidateStage` enum, and PostgreSQL database indexes on `stage`, `position`, and `createdAt`.
- [`lib/prisma.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/lib/prisma.ts):
  - **Environment**: Server runtime.
  - **Responsibility**: Implements the global singleton pattern to prevent connection exhaustion during development hot reloads.
- [`prisma/seed.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/prisma/seed.ts):
  - **Environment**: Node / tsx CLI.
  - **Responsibility**: Seeds 12 realistic candidates across all 6 hiring stages with varied job titles.

### Validation & Domain Logic
- [`lib/validations/candidate.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/lib/validations/candidate.ts):
  - **Environment**: Shared (runs on server for API validation, in browser for form checks, in tests).
  - **Responsibility**: Defines strict schemas: `createCandidateSchema`, `updateCandidateSchema`, `updateStageSchema`, and `candidateQuerySchema`.
- [`lib/services/candidateService.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/lib/services/candidateService.ts):
  - **Environment**: Server only.
  - **Responsibility**: Contains all domain operations: `getCandidates` (with search and filtering), `getCandidateById`, `createCandidate` (with duplicate email checking), `updateCandidate`, `updateCandidateStage`, `deleteCandidate`, and `getDashboardMetrics`.

### API Layer (Next.js App Router)
- [`app/api/candidates/route.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/app/api/candidates/route.ts):
  - **GET**: Validates query parameters (`search`, `stage`, `position`, `page`, `limit`) and returns paginated candidates.
  - **POST**: Validates candidate body and creates candidate; returns `409 Conflict` on duplicate email, `400 Bad Request` on invalid input.
- [`app/api/candidates/[id]/route.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/app/api/candidates/%5Bid%5D/route.ts):
  - **GET**: Retrieves candidate profile by ID.
  - **PUT**: Updates candidate details.
  - **DELETE**: Deletes candidate record.
- [`app/api/candidates/[id]/stage/route.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/app/api/candidates/%5Bid%5D/stage/route.ts):
  - **PATCH**: Atomically changes candidate stage.
- [`app/api/dashboard/route.ts`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/app/api/dashboard/route.ts):
  - **GET**: Aggregates total candidates, active candidates, 6-stage distribution array for Recharts, and 5 recent applicants.

### Frontend Components
- [`app/page.tsx`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/app/page.tsx):
  - Client component coordinating tab switching (`dashboard`, `candidates`, `pipeline`), candidate modals (add, edit, detail, delete), and toast feedback.
- [`components/pipeline/pipeline-board.tsx`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/components/pipeline/pipeline-board.tsx):
  - Visual 6-column pipeline board with direct stage advancement (`ChevronRight`), immediate rejection (`XCircle`), and direct dropdown stage selection.
- [`components/candidates/candidate-table.tsx`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/components/candidates/candidate-table.tsx):
  - Responsive table showing applicant name, role, experience, contact details, inline stage changer, and edit/delete actions.
- [`components/dashboard/stage-chart.tsx`](file:///c:/Users/dheer/OneDrive/Desktop/web%20dev/intership%20assignments/earlyjobs_ai/components/dashboard/stage-chart.tsx):
  - Client-side Recharts bar chart showing candidate breakdown across all stages.
