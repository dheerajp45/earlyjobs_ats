import { NextRequest, NextResponse } from "next/server";
import {
  createCandidateSchema,
  candidateQuerySchema,
} from "@/lib/validations/candidate";
import {
  getCandidates,
  createCandidate,
  ConflictError,
} from "@/lib/services/candidateService";
import { ZodError } from "zod";

/**
 * Route Handler for /api/candidates
 * Runs exclusively in the Node.js server runtime.
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsedQuery = candidateQuerySchema.parse(searchParams);

    const result = await getCandidates(parsedQuery);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("GET /api/candidates error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while retrieving candidates." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCandidateSchema.parse(body);

    const newCandidate = await createCandidate(validatedData);
    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    console.error("POST /api/candidates error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while creating the candidate." },
      { status: 500 }
    );
  }
}
