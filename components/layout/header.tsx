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
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Mobile Navigation & Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab Switcher */}
          <div className="flex sm:hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => onTabChange("dashboard")}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === "dashboard"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 font-semibold shadow-xs"
                  : "text-zinc-500"
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <button
              onClick={() => onTabChange("candidates")}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === "candidates"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 font-semibold shadow-xs"
                  : "text-zinc-500"
              }`}
              title="Candidates"
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              onClick={() => onTabChange("pipeline")}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === "pipeline"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 font-semibold shadow-xs"
                  : "text-zinc-500"
              }`}
              title="Pipeline"
            >
              <GitPullRequest className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onNewCandidate}
            className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </header>
  );
}
