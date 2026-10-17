"use client";

import React from "react";
import { NavTab } from "./sidebar";
import { LayoutDashboard, Users, GitPullRequest, Plus } from "lucide-react";

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewCandidate: () => void;
  candidateCount: number;
}

export function Header({
  activeTab,
  onTabChange,
  onNewCandidate,
  candidateCount,
}: HeaderProps) {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Recruitment Dashboard",
      subtitle: "Candidate flow metrics and pipeline status across all active roles",
    },
    candidates: {
      title: "Candidate Directory",
      subtitle: "Filter, search, review, and manage applicant profiles",
    },
    pipeline: {
      title: "Hiring Pipeline Board",
      subtitle: "Visual stage-by-stage Kanban funnel with quick transitions",
    },
  };

  const { title, subtitle } = titles[activeTab];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shrink-0 z-30 px-4 py-3 sm:px-6 sm:py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate hidden sm:block">
            {subtitle}
          </p>
        </div>

        {/* Mobile & Desktop Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNewCandidate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
