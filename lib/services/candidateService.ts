import { prisma } from "@/lib/prisma";
import {
  CreateCandidateInput,
  UpdateCandidateInput,
  CandidateQueryInput,
  CandidateStage,
} from "@/lib/validations/candidate";
import { Prisma } from "@prisma/client";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Service functions contain all business and persistence logic.
 * They run exclusively on the server side and never expose raw DB errors directly to the client.
 */

export async function getCandidates(query: CandidateQueryInput) {
  const { search, stage, position, page = 1, limit = 50 } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.CandidateWhereInput = {};

  if (stage) {
    where.stage = stage;
  }

  if (position) {
    where.position = {
      contains: position,
      mode: "insensitive",
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { position: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, candidates] = await Promise.all([
    prisma.candidate.count({ where }),
    prisma.candidate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    candidates,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getCandidateById(id: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
  });

  if (!candidate) {
    throw new NotFoundError(`Candidate with ID "${id}" was not found.`);
  }

  return candidate;
}

export async function createCandidate(data: CreateCandidateInput) {
  // Check for duplicate email policy
  const existing = await prisma.candidate.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new ConflictError(
      `A candidate with the email address "${data.email}" already exists in the system.`
    );
  }

  return prisma.candidate.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      experience: data.experience,
      resumeUrl: data.resumeUrl,
      stage: data.stage,
      notes: data.notes,
    },
  });
}

export async function updateCandidate(id: string, data: UpdateCandidateInput) {
  // Verify existence
  await getCandidateById(id);

  if (data.email) {
    const existing = await prisma.candidate.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== id) {
      throw new ConflictError(
        `Another candidate is already registered with email "${data.email}".`
      );
    }
  }

  return prisma.candidate.update({
    where: { id },
    data,
  });
}

export async function updateCandidateStage(id: string, stage: CandidateStage) {
  await getCandidateById(id);

  return prisma.candidate.update({
    where: { id },
    data: { stage },
  });
}

export async function deleteCandidate(id: string) {
  await getCandidateById(id);

  return prisma.candidate.delete({
    where: { id },
  });
}

export async function getDashboardMetrics() {
  const allStages: CandidateStage[] = [
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "REJECTED",
  ];

  const [totalCandidates, stageCountsRaw, recentCandidates] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.groupBy({
      by: ["stage"],
      _count: {
        stage: true,
      },
    }),
    prisma.candidate.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Map into a normalized record guaranteeing all 6 stages are present
  const stageCounts: Record<CandidateStage, number> = {
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    OFFER: 0,
    HIRED: 0,
    REJECTED: 0,
  };

  stageCountsRaw.forEach((item) => {
    stageCounts[item.stage] = item._count.stage;
  });

  // Recharts visualization data format
  const stageDistribution = allStages.map((stage) => ({
    stage,
    label: stage.charAt(0) + stage.slice(1).toLowerCase(),
    count: stageCounts[stage],
  }));

  // Distinct position count
  const positionsRaw = await prisma.candidate.findMany({
    select: { position: true },
    distinct: ["position"],
  });

  return {
    totalCandidates,
    activeCandidates:
      totalCandidates - (stageCounts.HIRED + stageCounts.REJECTED),
    stageCounts,
    stageDistribution,
    recentCandidates,
    distinctPositionsCount: positionsRaw.length,
  };
}
