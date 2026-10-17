import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../lib/prisma";
import {
  createCandidate,
  getCandidates,
  updateCandidateStage,
  getDashboardMetrics,
  deleteCandidate,
  ConflictError,
  NotFoundError,
} from "../lib/services/candidateService";

describe("Candidate Service Integration Tests", () => {
  const testCandidateEmail = "vitest.tester@example.com";
  let createdCandidateId = "";

  afterAll(async () => {
    // Cleanup any test leftovers
    await prisma.candidate.deleteMany({
      where: {
        email: {
          in: [testCandidateEmail, "vitest.duplicate@example.com"],
        },
      },
    });
  });

  it("creates a candidate successfully", async () => {
    const candidate = await createCandidate({
      name: "Vitest Candidate",
      email: testCandidateEmail,
      phone: "+91 99999 88888",
      position: "QA Automation Engineer",
      experience: 4,
      rating: 5,
      stage: "APPLIED",
      notes: "Created during vitest execution",
    });

    expect(candidate).toBeDefined();
    expect(candidate.id).toBeTruthy();
    expect(candidate.email).toBe(testCandidateEmail);
    expect(candidate.stage).toBe("APPLIED");
    expect(candidate.rating).toBe(5);

    createdCandidateId = candidate.id;
  });

  it("throws ConflictError when creating a candidate with an identical email", async () => {
    await expect(
      createCandidate({
        name: "Duplicate User",
        email: testCandidateEmail,
        position: "Security Analyst",
        stage: "APPLIED",
      })
    ).rejects.toThrow(ConflictError);
  });

  it("updates candidate stage atomically to INTERVIEW and REJECTED", async () => {
    const updated = await updateCandidateStage(createdCandidateId, "INTERVIEW");
    expect(updated.stage).toBe("INTERVIEW");

    const rejected = await updateCandidateStage(createdCandidateId, "REJECTED");
    expect(rejected.stage).toBe("REJECTED");
  });

  it("updates candidates in bulk using bulkUpdateCandidateStage", async () => {
    const { bulkUpdateCandidateStage } = await import(
      "../lib/services/candidateService"
    );
    const result = await bulkUpdateCandidateStage(
      [createdCandidateId],
      "OFFER"
    );
    expect(result.count).toBe(1);

    const verified = await prisma.candidate.findUnique({
      where: { id: createdCandidateId },
    });
    expect(verified?.stage).toBe("OFFER");
  });

  it("filters candidates by search and stage", async () => {
    const result = await getCandidates({
      search: "Vitest Candidate",
      stage: "OFFER",
      page: 1,
      limit: 10,
    });

    expect(result.candidates.length).toBeGreaterThanOrEqual(1);
    expect(result.candidates[0].email).toBe(testCandidateEmail);
  });

  it("fetches dashboard metrics with all 6 stages and active count", async () => {
    const metrics = await getDashboardMetrics();

    expect(metrics.totalCandidates).toBeGreaterThan(0);
    expect(metrics.stageCounts).toHaveProperty("APPLIED");
    expect(metrics.stageCounts).toHaveProperty("SCREENING");
    expect(metrics.stageCounts).toHaveProperty("INTERVIEW");
    expect(metrics.stageCounts).toHaveProperty("OFFER");
    expect(metrics.stageCounts).toHaveProperty("HIRED");
    expect(metrics.stageCounts).toHaveProperty("REJECTED");
    expect(metrics.stageDistribution).toHaveLength(6);
  });

  it("deletes the candidate cleanly", async () => {
    await deleteCandidate(createdCandidateId);

    await expect(
      prisma.candidate.findUnique({ where: { id: createdCandidateId } })
    ).resolves.toBeNull();
  });

  it("throws NotFoundError when trying to update non-existent candidate", async () => {
    await expect(
      updateCandidateStage("non-existent-cuid-9999", "OFFER")
    ).rejects.toThrow(NotFoundError);
  });
});
