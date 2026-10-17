import { NextRequest, NextResponse } from "next/server";
import { updateStageSchema } from "@/lib/validations/candidate";
import {
  updateCandidateStage,
  NotFoundError,
} from "@/lib/services/candidateService";
import { ZodError } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { stage } = updateStageSchema.parse(body);

    const updated = await updateCandidateStage(id, stage);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid stage provided", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("PATCH /api/candidates/[id]/stage error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while updating the candidate stage." },
      { status: 500 }
    );
  }
}
