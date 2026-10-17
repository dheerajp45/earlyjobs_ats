# Data Model Specification

## 1. PostgreSQL Schema (via Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum CandidateStage {
  APPLIED
  SCREENING
  INTERVIEW
  OFFER
  HIRED
  REJECTED
}

model Candidate {
  id         String         @id @default(cuid())
  name       String
  email      String         @unique
  phone      String?
  position   String
  experience Int?
  resumeUrl  String?
  stage      CandidateStage @default(APPLIED)
  notes      String?
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@index([stage])
  @@index([position])
  @@index([createdAt])
}
```

---

## 2. Fields & Constraints

| Field | Type | Required | Description & Constraints |
|---|---|---|---|
| `id` | `String` (CUID) | Yes | Primary key, uniquely identifies candidate record. |
| `name` | `String` | Yes | Candidate full name (2–100 characters). |
| `email` | `String` | Yes | Unique email address; system prevents duplicates. Normalized to lowercase. |
| `phone` | `String` | No | Optional contact phone number (max 20 characters). |
| `position` | `String` | Yes | Target job title (e.g. "Frontend Engineer", "Product Designer"). |
| `experience`| `Int` | No | Years of professional experience (0–50). |
| `resumeUrl` | `String` | No | Optional URL to candidate resume or portfolio. |
| `stage` | `CandidateStage` | Yes | Current hiring stage. Default: `APPLIED`. |
| `notes` | `String` | No | Recruiter feedback and notes (max 1,000 characters). |
| `createdAt` | `DateTime` | Yes | Record creation timestamp. |
| `updatedAt` | `DateTime` | Yes | Automatically updated on every modification. |

---

## 3. Indexes & Performance Optimization
- `@@index([stage])`: Optimizes Kanban pipeline column queries and stage-based filtering.
- `@@index([position])`: Speeds up job position filtering and distinct role queries for the dashboard.
- `@@index([createdAt])`: Speeds up descending chronological order queries for recent applicants and candidate lists.
