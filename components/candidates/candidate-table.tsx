"use client";

import React, { useState } from "react";
import { StageBadge } from "@/components/ui/badge";
import { CandidateStage } from "@/lib/validations/candidate";
import {
  Eye,
  Edit2,
  Trash2,
  Mail,
  Briefcase,
  Calendar,
  ExternalLink,
  Star,
  CheckSquare,
  XCircle,
} from "lucide-react";
import { CandidateDetailData } from "./candidate-detail-modal";

interface CandidateTableProps {
  candidates: CandidateDetailData[];
  onView: (candidate: CandidateDetailData) => void;
  onEdit: (candidate: CandidateDetailData) => void;
  onDelete: (candidate: CandidateDetailData) => void;
  onStageChange: (id: string, stage: CandidateStage) => Promise<void>;
  onBulkStageChange?: (ids: string[], stage: CandidateStage) => Promise<void>;
  loading?: boolean;
}

const STAGES: { value: CandidateStage; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export function CandidateTable({
  candidates,
  onView,
  onEdit,
  onDelete,
  onStageChange,
  onBulkStageChange,
  loading,
}: CandidateTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const isAllSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStage = async (stage: CandidateStage) => {
    if (!onBulkStageChange || selectedIds.length === 0) return;
    try {
      setBulkLoading(true);
      await onBulkStageChange(selectedIds, stage);
      setSelectedIds([]);
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 dark:border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-3 text-sm text-zinc-500">Loading candidates from database...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          No candidates found
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          No applicants match your current search or filter criteria. Try clearing filters or create a new candidate.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && onBulkStageChange && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200 rounded-2xl shadow-lg transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
            <span className="text-xs font-semibold">
              {selectedIds.length} candidate{selectedIds.length === 1 ? "" : "s"} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
              Bulk Stage:
            </span>
            <select
              disabled={bulkLoading}
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStage(e.target.value as CandidateStage);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-zinc-700 dark:border-zinc-300 bg-zinc-800 dark:bg-white text-zinc-100 dark:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 cursor-pointer"
            >
              <option value="" disabled>
                Move all to stage...
              </option>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  Move to {s.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={bulkLoading}
              onClick={() => handleBulkStage("REJECTED")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject Selected
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/40 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {onBulkStageChange && (
                  <th scope="col" className="px-4 py-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                      title="Select all candidates"
                    />
                  </th>
                )}
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold">
                  Candidate Name
                </th>
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold">
                  Position & Experience
                </th>
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold">
                  Scorecard
                </th>
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold">
                  Hiring Stage
                </th>
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold">
                  Applied Date
                </th>
                <th scope="col" className="px-4 sm:px-5 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {candidates.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`transition-colors group ${
                      isSelected
                        ? "bg-zinc-100/70 dark:bg-zinc-800/50"
                        : "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    {/* Checkbox */}
                    {onBulkStageChange && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(c.id)}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Candidate Name & Email */}
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex flex-col">
                        <button
                          onClick={() => onView(c)}
                          className="text-left font-semibold text-zinc-900 dark:text-zinc-100 hover:underline transition-all cursor-pointer"
                        >
                          {c.name}
                        </button>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <Mail className="h-3 w-3 shrink-0" /> {c.email}
                        </span>
                      </div>
                    </td>

                    {/* Position & Experience */}
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {c.position}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {c.experience !== null && c.experience !== undefined
                            ? `${c.experience} yr${c.experience === 1 ? "" : "s"} experience`
                            : "Experience not specified"}
                        </span>
                      </div>
                    </td>

                    {/* Scorecard / Star Rating */}
                    <td className="px-4 sm:px-5 py-3">
                      {c.rating ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span>{c.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Stage with Direct Selector */}
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex items-center gap-2">
                        <StageBadge stage={c.stage} size="sm" />
                        <select
                          value={c.stage}
                          onChange={(e) =>
                            onStageChange(c.id, e.target.value as CandidateStage)
                          }
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-xs px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-opacity focus:opacity-100 cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s.value} value={s.value}>
                              Move to {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {c.resumeUrl && (
                          <a
                            href={c.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Open Resume"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => onView(c)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(c)}
                          className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Candidate"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(c)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Candidate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
