# Testing Strategy & Execution

## 1. Overview
The Mini ATS uses **Vitest 5** for automated validation and integration testing against the actual database layer.

---

## 2. Test Suites

### A. Validation Unit Tests (`tests/validations.test.ts`)
- Tests parsing and validation rules in `lib/validations/candidate.ts`.
- Validates proper handling of:
  - Valid candidate submissions.
  - Automatic trimming and lowercasing of email addresses.
  - Rejection of invalid email formats.
  - Rejection of short names (< 2 characters).
  - Rejection of negative experience values.
  - Empty string handling for optional URLs.
  - Rejection of non-existent stages in `updateStageSchema`.
  - Type coercion of string parameters in `candidateQuerySchema`.

### B. Service Integration Tests (`tests/candidateService.test.ts`)
- Tests database business logic in `lib/services/candidateService.ts`.
- Validates:
  - Candidate creation and ID generation.
  - Duplicate email conflict rejection (`ConflictError`).
  - Stage transitions (`INTERVIEW`, `REJECTED`).
  - Filtering and searching by name and stage.
  - Real-time dashboard metric aggregation across all 6 stages.
  - Deletion of candidate records.
  - Proper handling of non-existent IDs (`NotFoundError`).

---

## 3. Running the Tests

To run the full test suite:
```bash
npm test
```

Expected output:
```
 ✓ tests/candidateService.test.ts (7 tests)
 ✓ tests/validations.test.ts (9 tests)

 Test Files  2 passed (2)
      Tests  16 passed (16)
```
