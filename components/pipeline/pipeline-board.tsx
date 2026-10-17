"use client";

import React, { useState } from "react";
import { CandidateStage } from "@/lib/validations/candidate";
import { CandidateDetailData } from "../candidates/candidate-detail-modal";
import { StageBadge } from "../ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Mail,
  Eye,
  XCircle,
  RotateCcw,
  Star,
  GripVertical,
  ArrowDown,
} from "lucide-react";

interface PipelineBoardProps {
  candidates: CandidateDetailData[];
  onView: (candidate: CandidateDetailData) => void;
  onStageChange: (id: string, stage: CandidateStage) => Promise<void>;
  loading?: boolean;
}

const STAGES_ORDER: { key: CandidateStage; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "SCREENING", label: "Screening" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "HIRED", label: "Hired" },
  { key: "REJECTED", label: "Rejected" },
];

export function PipelineBoard({
  candidates,
  onView,
  onStageChange,
  loading,
}: PipelineBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CandidateStage | null>(null);

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
        <p className="mt-3 text-sm text-zinc-500">Loading pipeline stages...</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: CandidateStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const candidateId = e.dataTransfer.getData("text/plain") || draggingId;
    setDraggingId(null);

    if (!candidateId) return;

    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate && candidate.stage !== targetStage) {
      await onStageChange(candidateId, targetStage);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Visual Instruction Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <GripVertical className="h-3.5 w-3.5 text-indigo-500" />
          <span>Tip: <strong>Drag and drop</strong> cards between columns to change stages, or use quick action buttons.</span>
        </span>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {STAGES_ORDER.map((stageObj, idx) => {
            const stageCandidates = candidates.filter(
              (c) => c.stage === stageObj.key
            );
            const isColumnOver = dragOverStage === stageObj.key;

            return (
              <div
                key={stageObj.key}
                onDragOver={(e) => handleDragOver(e, stageObj.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stageObj.key)}
                className={`flex-1 min-w-[230px] rounded-2xl flex flex-col max-h-[75vh] transition-all duration-200 border ${
                  isColumnOver
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-400/50 shadow-md scale-[1.01]"
                    : "bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                      {stageObj.label}
                    </span>
                    <span className="inline-flex items-center justify-center h-5 px-2 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {stageCandidates.length}
                    </span>
                  </div>
                </div>

                {/* Drop Zone Highlight Hint */}
                {isColumnOver && (
                  <div className="mx-2.5 mt-2.5 p-2 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-100/50 dark:bg-indigo-900/40 text-center animate-pulse">
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-1">
                      <ArrowDown className="h-3 w-3" /> Drop here to move to {stageObj.label}
                    </p>
                  </div>
                )}

                {/* Column Card List */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {stageCandidates.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <p className="text-xs text-zinc-400">No candidates</p>
                    </div>
                  ) : (
                    stageCandidates.map((candidate) => {
                      const isDragging = draggingId === candidate.id;

                      return (
                        <div
                          key={candidate.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, candidate.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white dark:bg-zinc-900 rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none ${
                            isDragging
                              ? "opacity-40 border-indigo-400 ring-2 ring-indigo-400 shadow-lg scale-95"
                              : "border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div>
                            {/* Grip & Header */}
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <GripVertical className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                                <h4
                                  onClick={() => onView(candidate)}
                                  className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors truncate"
                                >
                                  {candidate.name}
                                </h4>
                              </div>
                              <button
                                onClick={() => onView(candidate)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 shrink-0"
                                title="View candidate details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Position */}
                            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mb-1 truncate pl-5">
                              <Briefcase className="h-3 w-3 shrink-0 text-zinc-400" />
                              <span className="truncate">{candidate.position}</span>
                            </p>

                            {/* Email */}
                            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-1.5 truncate pl-5">
                              <Mail className="h-3 w-3 shrink-0 text-zinc-400" />
                              <span className="truncate">{candidate.email}</span>
                            </p>

                            {/* Scorecard Star Rating */}
                            {candidate.rating && (
                              <div className="pl-5 mb-2 flex items-center gap-1">
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                                  <span>{candidate.rating}/5</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stage Selector Dropdown */}
                          <div className="my-1.5">
                            <select
                              value={candidate.stage}
                              onChange={(e) =>
                                onStageChange(
                                  candidate.id,
                                  e.target.value as CandidateStage
                                )
                              }
                              className="w-full text-[11px] font-medium py-1 px-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            >
                              {STAGES_ORDER.map((s) => (
                                <option key={s.key} value={s.key}>
                                  Move to: {s.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quick Stage Action Buttons */}
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-1">
                            {/* If in Rejected: Reopen/Restore button */}
                            {stageObj.key === "REJECTED" ? (
                              <button
                                onClick={() =>
                                  onStageChange(candidate.id, "APPLIED")
                                }
                                className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Restore candidate to Applied"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span>Reopen Application</span>
                              </button>
                            ) : (
                              <>
                                {/* Prev Button */}
                                {idx > 0 && idx < 5 ? (
                                  <button
                                    onClick={() =>
                                      onStageChange(
                                        candidate.id,
                                        STAGES_ORDER[idx - 1].key
                                      )
                                    }
                                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                    title={`Move back to ${STAGES_ORDER[idx - 1].label}`}
                                  >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span>Prev</span>
                                  </button>
                                ) : (
                                  <div />
                                )}

                                {/* Direct Reject Button */}
                                {stageObj.key !== "HIRED" && (
                                  <button
                                    onClick={() =>
                                      onStageChange(candidate.id, "REJECTED")
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title="Reject candidate immediately"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    <span>Reject</span>
                                  </button>
                                )}

                                {/* Advance Forward Button */}
                                {idx < 4 ? (
                                  <button
                                    onClick={() =>
                                      onStageChange(
                                        candidate.id,
                                        STAGES_ORDER[idx + 1].key
                                      )
                                    }
                                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                                    title={`Advance to ${STAGES_ORDER[idx + 1].label}`}
                                  >
                                    <span>Advance</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
