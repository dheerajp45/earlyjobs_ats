"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  PlusCircle,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab = "dashboard" | "candidates" | "pipeline";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewCandidate: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  onNewCandidate,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Pipeline overview & analytics",
    },
    {
      id: "candidates" as NavTab,
      label: "Candidates",
      icon: Users,
      description: "Directory, search & filters",
    },
    {
      id: "pipeline" as NavTab,
      label: "Hiring Pipeline",
      icon: GitPullRequest,
      description: "Stage management board",
    },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between shrink-0 h-full">
      <div>
        {/* Brand / Logo */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xs">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                TalentTrack ATS
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">
                EarlyJobs AI Recruitment
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={onNewCandidate}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-semibold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Candidate</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-white dark:text-zinc-950"
                      : "text-zinc-400"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="rounded-xl p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              PostgreSQL Connected
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Prisma ORM • Next.js API
          </p>
        </div>
      </div>
    </aside>
  );
}
