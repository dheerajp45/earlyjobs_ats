"use client";

import React from "react";
import { Users, UserCheck, Briefcase, TrendingUp } from "lucide-react";

interface MetricCardsProps {
  totalCandidates: number;
  activeCandidates: number;
  hiredCount: number;
  distinctPositionsCount: number;
}

export function MetricCards({
  totalCandidates,
  activeCandidates,
  hiredCount,
  distinctPositionsCount,
}: MetricCardsProps) {
  const cards = [
    {
      label: "Total Candidates",
      value: totalCandidates,
      description: "All applicants in database",
      icon: Users,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      border: "border-zinc-200 dark:border-zinc-700",
    },
    {
      label: "Active Pipeline",
      value: activeCandidates,
      description: "Screening, Interview & Offer",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200/60 dark:border-amber-900/60",
    },
    {
      label: "Hired Applicants",
      value: hiredCount,
      description: "Successfully accepted offers",
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200/60 dark:border-emerald-900/60",
    },
    {
      label: "Open Job Positions",
      value: distinctPositionsCount,
      description: "Unique roles with applications",
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200/60 dark:border-blue-900/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl ${c.bg} ${c.color} border ${c.border}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {c.value}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {c.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
