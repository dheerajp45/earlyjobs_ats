import { NextRequest, NextResponse } from "next/server";
import { updateCandidateSchema } from "@/lib/validations/candidate";
import {
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  NotFoundError,
  ConflictError,
} from "@/lib/services/candidateService";
import { ZodError } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const candidate = await getCandidateById(id);
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("GET /api/candidates/[id] error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = updateCandidateSchema.parse(body);

    const updated = await updateCandidate(id, validatedData);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("PUT /api/candidates/[id] error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while updating the candidate." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteCandidate(id);
    return NextResponse.json(
      { message: "Candidate successfully deleted", id },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("DELETE /api/candidates/[id] error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while deleting the candidate." },
      { status: 500 }
    );
  }
}
