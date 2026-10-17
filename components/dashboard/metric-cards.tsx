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
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-100 dark:border-indigo-900/60",
    },
    {
      label: "Active Pipeline",
      value: activeCandidates,
      description: "Screening, Interview & Offer",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/60",
    },
    {
      label: "Hired Applicants",
      value: hiredCount,
      description: "Successfully accepted offers",
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/60",
    },
    {
      label: "Open Job Positions",
      value: distinctPositionsCount,
      description: "Unique roles with applications",
      icon: Briefcase,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-100 dark:border-purple-900/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {c.label}
              </span>
              <div className={`p-2.5 rounded-xl ${c.bg} ${c.color} border ${c.border}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {c.value}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {c.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
