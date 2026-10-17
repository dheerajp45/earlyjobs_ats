# Mini Applicant Tracking System (ATS)

A production-minded, full-stack **Mini Applicant Tracking System** built with **Next.js App Router**, **React 19**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma ORM**.

Designed for recruitment workflows: manage candidate profiles, track applications across a 6-stage hiring pipeline, perform database-level multi-field search and filtering, and monitor real-time hiring metrics.

---

## ✨ Features

- **📊 Real-time Dashboard**:
  - 4 summary KPI metric cards (Total Candidates, Active Pipeline, Hired, Open Positions).
  - Stage distribution visualization using **Recharts**.
  - Recent applicants feed with stage badges and quick details.
- **👥 Candidate Management (Full CRUD)**:
  - Add candidates with instant Zod field validation (Name, Email, Phone, Role, Experience, Rating, Resume URL, Notes).
  - Duplicate email conflict detection (HTTP 409).
  - Edit candidate details and delete with confirmation dialog.
  - Candidate detail modal with full recruiter notes and resume link.
- **⭐ Interview Scorecards (1–5 Star Ratings)**:
  - Interactive star rating picker for recruiter and interview technical evaluations.
  - Visual star badges across Candidate Table, Pipeline Cards, and Candidate Profile modal.
- **🔄 Interactive Drag-and-Drop Pipeline (Kanban Board)**:
  - 6 clearly organized columns: `Applied`, `Screening`, `Interview`, `Offer`, `Hired`, `Rejected`.
  - **Native Drag-and-Drop**: Drag candidates between columns with animated drop indicators.
  - Quick **Advance** button to move candidates forward.
  - Dedicated direct **Reject** button to disqualify candidates immediately from any stage.
  - Inline stage dropdown selector for direct jumps.
- **☑️ Bulk Stage Actions**:
  - Select all or individual candidates with checkboxes.
  - Floating bulk toolbar: batch-move selected candidates to any stage or batch-reject in a single atomic transaction.
- **📥 Export to CSV**:
  - Export filtered candidates and their full profiles (ratings, stages, contact info, notes) to a `.csv` spreadsheet for external analysis.
- **🔍 Database Search & Filtering**:
  - Multi-field search across candidate name, email, and job position.
  - Filter by hiring stage and position.
  - Reset filters with a single click.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Route Handlers)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM v6.19.3](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest 5](https://vitest.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally or hosted (e.g. Neon, Supabase, Railway)

### 2. Environment Setup
Copy the sample environment file:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL connection URL:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/earlyjobs_ats?schema=public"
```

### 3. Install Dependencies & Setup Database
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run unit and integration test suites:
```bash
npm test
```

All 16 tests cover:
- Zod schema input validation, email trimming, and negative experience handling.
- Candidate CRUD database operations.
- Duplicate email conflict rejection (`ConflictError`).
- Pipeline stage transitions and dashboard metric aggregations.

---

## 📚 Documentation

- [File Guide & Responsibilities](docs/FILE_GUIDE.md)
- [Request Flows & Architecture](docs/REQUEST_FLOWS.md)
- [System Architecture](ARCHITECTURE.md)
- [Data Model & Schema](DATA_MODEL.md)
- [Testing Strategy](TESTING.md)
- [Architecture Decisions (ADRs)](DECISIONS.md)
