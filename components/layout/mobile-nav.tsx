"use client";

import React from "react";
import { LayoutDashboard, Users, GitPullRequest } from "lucide-react";
import { NavTab } from "./sidebar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  candidateCount?: number;
}

export function MobileNav({
  activeTab,
  onTabChange,
  candidateCount,
}: MobileNavProps) {
  const items = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "candidates" as NavTab,
      label: "Candidates",
      icon: Users,
      badge: candidateCount,
    },
    {
      id: "pipeline" as NavTab,
      label: "Pipeline",
      icon: GitPullRequest,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-3 py-1.5 flex items-center justify-around shadow-lg"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative",
              isActive
                ? "text-zinc-900 dark:text-zinc-100 font-bold"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors",
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : ""
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && item.id === "candidates" && (
              <span className="absolute top-1 right-2 inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
