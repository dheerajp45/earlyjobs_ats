import { describe, it, expect } from "vitest";
import {
  createCandidateSchema,
  updateCandidateSchema,
  updateStageSchema,
  bulkUpdateStageSchema,
  candidateQuerySchema,
} from "../lib/validations/candidate";

describe("Candidate Validations", () => {
  describe("createCandidateSchema", () => {
    it("accepts valid candidate input", () => {
      const validData = {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        position: "Frontend Engineer",
        experience: 3,
        resumeUrl: "https://example.com/resume.pdf",
        stage: "APPLIED" as const,
        notes: "Solid React background.",
      };

      const result = createCandidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("aarav.sharma@example.com");
      }
    });

    it("normalizes email to lowercase and trims whitespace", () => {
      const data = {
        name: "  Priya Patel  ",
        email: "  PRIYA.PATEL@EXAMPLE.COM  ",
        position: "Backend Engineer",
      };

      const result = createCandidateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Priya Patel");
        expect(result.data.email).toBe("priya.patel@example.com");
        expect(result.data.stage).toBe("APPLIED");
      }
    });

    it("rejects invalid email formats", () => {
      const data = {
        name: "Rohan Verma",
        email: "not-an-email",
        position: "Full Stack Engineer",
      };

      const result = createCandidateSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("rejects names shorter than 2 characters", () => {
      const data = {
        name: "A",
        email: "a@example.com",
        position: "QA Engineer",
      };

      const result = createCandidateSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
      }
    });

    it("rejects negative experience", () => {
      const data = {
        name: "Kavita Rao",
        email: "kavita@example.com",
        position: "DevOps Engineer",
        experience: -1,
      };

      const result = createCandidateSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Experience cannot be negative");
      }
    });

    it("accepts empty string for resumeUrl", () => {
      const data = {
        name: "Ananya Roy",
        email: "ananya@example.com",
        position: "Product Designer",
        resumeUrl: "",
      };

      const result = createCandidateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
    it("validates 1 to 5 star rating boundaries", () => {
      const valid = createCandidateSchema.safeParse({
        name: "Test User",
        email: "test.star@example.com",
        position: "Architect",
        rating: 4,
      });
      expect(valid.success).toBe(true);

      const tooLow = createCandidateSchema.safeParse({
        name: "Test User",
        email: "test.star@example.com",
        position: "Architect",
        rating: 0,
      });
      expect(tooLow.success).toBe(false);

      const tooHigh = createCandidateSchema.safeParse({
        name: "Test User",
        email: "test.star@example.com",
        position: "Architect",
        rating: 6,
      });
      expect(tooHigh.success).toBe(false);
    });
  });

  describe("updateStageSchema", () => {
    it("accepts valid pipeline stages", () => {
      const stages = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"] as const;
      for (const stage of stages) {
        const result = updateStageSchema.safeParse({ stage });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid stage values", () => {
      const result = updateStageSchema.safeParse({ stage: "ARCHIVED" });
      expect(result.success).toBe(false);
    });
  });

  describe("bulkUpdateStageSchema", () => {
    it("accepts valid candidate IDs and a pipeline stage", () => {
      const result = bulkUpdateStageSchema.safeParse({
        ids: ["cand-1", "cand-2", "cand-3"],
        stage: "HIRED",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ids).toHaveLength(3);
        expect(result.data.stage).toBe("HIRED");
      }
    });

    it("rejects an empty array of candidate IDs", () => {
      const result = bulkUpdateStageSchema.safeParse({
        ids: [],
        stage: "REJECTED",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("candidateQuerySchema", () => {
    it("coerces page and limit string parameters into numbers", () => {
      const query = {
        page: "2",
        limit: "25",
        search: "Sharma",
        stage: "INTERVIEW",
      };

      const result = candidateQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(25);
        expect(result.data.search).toBe("Sharma");
        expect(result.data.stage).toBe("INTERVIEW");
      }
    });
  });
});
