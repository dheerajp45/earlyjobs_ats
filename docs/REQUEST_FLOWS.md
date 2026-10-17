# Request Flows & Execution Traces

This document details the exact execution paths for key user workflows in the Mini ATS, following data from the browser to the PostgreSQL database and back.

---

## 1. Flow: Creating a New Candidate

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter as Recruiter (Browser)
    participant UI as CandidateFormModal
    participant Page as app/page.tsx
    participant API as POST /api/candidates
    participant Service as candidateService.createCandidate
    participant DB as PostgreSQL (Prisma)

    Recruiter->>UI: Fills form & clicks "Save Candidate"
    UI->>UI: Validates with createCandidateSchema (client)
    UI->>Page: Calls onSave(payload)
    Page->>API: fetch('/api/candidates', { method: 'POST', body: JSON })
    API->>API: createCandidateSchema.safeParse(body)
    alt Invalid Input
        API-->>Page: 400 Bad Request { success: false, errors: [...] }
        Page-->>UI: Display form field error
    else Valid Input
        API->>Service: createCandidate(parsedData)
        Service->>DB: prisma.candidate.findUnique({ where: { email } })
        alt Email already exists
            DB-->>Service: Existing candidate found
            Service-->>API: throws ConflictError("Email already exists")
            API-->>Page: 409 Conflict { error: "..." }
            Page-->>Recruiter: Shows error notification toast
        else Unique Email
            Service->>DB: prisma.candidate.create({ data: ... })
            DB-->>Service: Newly created Candidate record
            Service-->>API: Returns candidate
            API-->>Page: 201 Created { success: true, candidate }
            Page->>Page: Refresh candidates list & dashboard metrics
            Page-->>Recruiter: Displays success toast and updates UI
        end
    end
```

---

## 2. Flow: Moving Candidate to "Rejected" or "Interview" (Pipeline Board)

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter as Recruiter (Browser)
    participant Board as PipelineBoard
    participant Page as app/page.tsx
    participant API as PATCH /api/candidates/:id/stage
    participant Service as candidateService.updateCandidateStage
    participant DB as PostgreSQL (Prisma)

    Recruiter->>Board: Clicks "Reject" (or selects stage from dropdown)
    Board->>Page: onStageChange(candidateId, "REJECTED")
    Page->>API: fetch(`/api/candidates/${id}/stage`, { method: 'PATCH', body: { stage: 'REJECTED' } })
    API->>API: updateStageSchema.safeParse(body)
    API->>Service: updateCandidateStage(id, 'REJECTED')
    Service->>DB: prisma.candidate.findUnique({ where: { id } })
    alt Candidate Not Found
        Service-->>API: throws NotFoundError
        API-->>Page: 404 Not Found
    else Candidate Exists
        Service->>DB: prisma.candidate.update({ where: { id }, data: { stage: 'REJECTED' } })
        DB-->>Service: Updated Candidate record
        Service-->>API: Returns updated candidate
        API-->>Page: 200 OK { success: true, candidate }
        Page->>Page: Updates local state & refetches metrics
        Page-->>Recruiter: Shows toast "Moved [Candidate Name] to REJECTED"
    end
```

---

## 3. Flow: Candidate Search and Filtering

1. **User Interaction**:
   - The user enters text into the search bar (e.g., `"Frontend"`) or chooses a stage filter (e.g., `"SCREENING"`).
2. **Client State**:
   - `components/candidates/candidate-filters.tsx` triggers `onSearchChange` or `onStageChange`.
   - `app/page.tsx` updates `filters` state and triggers `fetchCandidates(filters)`.
3. **HTTP Query**:
   - Client sends `GET /api/candidates?search=Frontend&stage=SCREENING&page=1&limit=50`.
4. **Validation**:
   - `candidateQuerySchema.safeParse(query)` verifies parameters.
5. **Database Execution**:
   - `candidateService.getCandidates` constructs a `where` condition using insensitive SQL pattern matching:
     ```prisma
     where: {
       stage: 'SCREENING',
       OR: [
         { name: { contains: 'Frontend', mode: 'insensitive' } },
         { email: { contains: 'Frontend', mode: 'insensitive' } },
         { position: { contains: 'Frontend', mode: 'insensitive' } },
       ]
     }
     ```
   - Queries `prisma.candidate.count` and `prisma.candidate.findMany` concurrently via `Promise.all`.
6. **Response**:
   - Server responds with `{ success: true, candidates: [...], pagination: { total, page, limit, totalPages } }`.
   - Client updates candidate table view immediately.
