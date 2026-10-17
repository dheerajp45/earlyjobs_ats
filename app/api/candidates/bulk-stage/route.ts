import { NextRequest, NextResponse } from "next/server";
import { bulkUpdateStageSchema } from "@/lib/validations/candidate";
import { bulkUpdateCandidateStage } from "@/lib/services/candidateService";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const result = bulkUpdateStageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { ids, stage } = result.data;
    const updateResult = await bulkUpdateCandidateStage(ids, stage);

    return NextResponse.json({
      success: true,
      message: `Successfully moved ${updateResult.count} candidates to ${stage}`,
      count: updateResult.count,
    });
  } catch (error: any) {
    console.error("Bulk stage update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while updating candidate stages.",
      },
      { status: 500 }
    );
  }
}
