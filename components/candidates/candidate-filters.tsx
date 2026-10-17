"use client";

import React from "react";
import { Search, X, Filter, Download } from "lucide-react";
import { CandidateStage } from "@/lib/validations/candidate";

interface CandidateFiltersProps {
  search: string;
  stage: string;
  position: string;
  positionsList: string[];
  onSearchChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onClearFilters: () => void;
  onExportCSV?: () => void;
  totalResults: number;
}

const STAGES: { value: CandidateStage; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export function CandidateFilters({
  search,
  stage,
  position,
  positionsList,
  onSearchChange,
  onStageChange,
  onPositionChange,
  onClearFilters,
  onExportCSV,
  totalResults,
}: CandidateFiltersProps) {
  const hasActiveFilters = Boolean(search || stage || position);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by candidate name, email, or position..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Stage Filter */}
        <div className="w-full md:w-48">
          <select
            value={stage}
            onChange={(e) => onStageChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer"
          >
            <option value="">All Hiring Stages</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Position Filter */}
        <div className="w-full md:w-56">
          <select
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer"
          >
            <option value="">All Job Titles</option>
            {positionsList.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* Export CSV Button */}
        {onExportCSV && (
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors shrink-0 cursor-pointer border border-zinc-200 dark:border-zinc-700"
            title="Export filtered candidates to CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" /> Export CSV
          </button>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" /> Reset Filters
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
        <span>
          Showing <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalResults}</span> candidates
        </span>
        {hasActiveFilters && (
          <span className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-semibold">
            <Filter className="h-3 w-3" /> Filters active
          </span>
        )}
      </div>
    </div>
  );
}
