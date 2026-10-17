import { z } from "zod";

export const candidateStageEnum = z.enum([
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
]);

export type CandidateStage = z.infer<typeof candidateStageEnum>;

export const createCandidateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional()
    .nullable(),
  position: z
    .string()
    .trim()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position cannot exceed 100 characters"),
  experience: z
    .coerce
    .number()
    .int("Years of experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .optional()
    .nullable(),
  rating: z
    .coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional()
    .nullable(),
  resumeUrl: z
    .string()
    .trim()
    .url("Resume URL must be a valid web link")
    .optional()
    .nullable()
    .or(z.literal("")),
  stage: candidateStageEnum.default("APPLIED"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .nullable(),
});

export const updateCandidateSchema = createCandidateSchema.partial();

export const updateStageSchema = z.object({
  stage: candidateStageEnum,
});

export const bulkUpdateStageSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one candidate ID must be provided"),
  stage: candidateStageEnum,
});

export const candidateQuerySchema = z.object({
  search: z.string().trim().optional(),
  stage: candidateStageEnum.optional(),
  position: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type UpdateStageInput = z.infer<typeof updateStageSchema>;
export type BulkUpdateStageInput = z.infer<typeof bulkUpdateStageSchema>;
export type CandidateQueryInput = z.infer<typeof candidateQuerySchema>;
