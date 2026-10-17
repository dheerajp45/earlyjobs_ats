import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/services/candidateService";

/**
 * Route Handler for /api/dashboard
 * Aggregates candidate metrics directly from PostgreSQL via Prisma.
 */

export async function GET() {
  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while compiling dashboard metrics." },
      { status: 500 }
    );
  }
}
