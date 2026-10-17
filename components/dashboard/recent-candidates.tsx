"use client";

import React from "react";
import { StageBadge } from "@/components/ui/badge";
import { CandidateDetailData } from "../candidates/candidate-detail-modal";
import { ArrowRight, Calendar } from "lucide-react";

interface RecentCandidatesProps {
  candidates: CandidateDetailData[];
  onView: (candidate: CandidateDetailData) => void;
  onViewAll: () => void;
}

export function RecentCandidates({
  candidates,
  onView,
  onViewAll,
}: RecentCandidatesProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Recently Added Candidates
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Latest applicants added to the tracking system
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {candidates.length === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-400">
            No candidates recorded yet.
          </p>
        ) : (
          candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => onView(c)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold text-xs shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">
                    {c.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {c.position}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StageBadge stage={c.stage} size="sm" />
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
