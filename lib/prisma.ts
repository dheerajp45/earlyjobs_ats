import { PrismaClient } from "@prisma/client";

/**
 * Global singleton pattern for PrismaClient.
 * In development, Next.js hot-reloads modules, which could create dozens of database connections.
 * Attaching the client to `globalThis` preserves a single pool of connections across reloads.
 * This runs strictly on the server side.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
