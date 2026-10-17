import React from "react";
import { cn } from "@/lib/utils";
import { CandidateStage } from "@/lib/validations/candidate";

interface StageBadgeProps {
  stage: CandidateStage;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const stageConfig: Record<
  CandidateStage,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  APPLIED: {
    label: "Applied",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-800 dark:text-zinc-200",
    border: "border-zinc-200 dark:border-zinc-700",
    dot: "bg-zinc-500",
  },
  SCREENING: {
    label: "Screening",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  INTERVIEW: {
    label: "Interview",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  OFFER: {
    label: "Offer",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
    dot: "bg-teal-500",
  },
  HIRED: {
    label: "Hired",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
};

export function StageBadge({ stage, className, size = "md" }: StageBadgeProps) {
  const config = stageConfig[stage] || {
    label: stage,
    bg: "bg-zinc-100",
    text: "text-zinc-800",
    border: "border-zinc-200",
    dot: "bg-zinc-400",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-xs font-medium px-2.5 py-1 gap-2",
    lg: "text-sm font-semibold px-3 py-1.5 gap-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border shadow-xs transition-colors",
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
