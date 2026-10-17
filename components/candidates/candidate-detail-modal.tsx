"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { StageBadge } from "@/components/ui/badge";
import { CandidateStage } from "@/lib/validations/candidate";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  Star,
} from "lucide-react";

export interface CandidateDetailData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  position: string;
  experience?: number | null;
  rating?: number | null;
  resumeUrl?: string | null;
  stage: CandidateStage;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface CandidateDetailModalProps {
  isOpen: boolean;
  candidate: CandidateDetailData | null;
  onClose: () => void;
  onEdit: (candidate: CandidateDetailData) => void;
  onDelete: (candidate: CandidateDetailData) => void;
  onStageChange: (id: string, stage: CandidateStage) => Promise<void>;
}

const STAGES: { value: CandidateStage; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export function CandidateDetailModal({
  isOpen,
  candidate,
  onClose,
  onEdit,
  onDelete,
  onStageChange,
}: CandidateDetailModalProps) {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidate.name}
      description={candidate.position}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Stage Status & Quick Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Current Stage:
            </span>
            <StageBadge stage={candidate.stage} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Move to:</span>
            <select
              value={candidate.stage}
              onChange={(e) =>
                onStageChange(candidate.id, e.target.value as CandidateStage)
              }
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact & Professional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Mail className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
              <a
                href={`mailto:${candidate.email}`}
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline break-all"
              >
                {candidate.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Phone className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Phone</p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {candidate.phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Briefcase className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Experience
              </p>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {candidate.experience !== null &&
                candidate.experience !== undefined
                  ? `${candidate.experience} Year${
                      candidate.experience === 1 ? "" : "s"
                    }`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <ExternalLink className="h-5 w-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Resume</p>
              {candidate.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  View Document <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-zinc-400">No link provided</p>
              )}
            </div>
          </div>
        </div>

        {/* Interview Scorecard / Rating */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Interview Scorecard Rating
            </h4>
            <p className="text-xs text-amber-700/80 dark:text-amber-400 mt-0.5">
              Recruiter technical & culture evaluation
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4.5 w-4.5 ${
                  candidate.rating && star <= candidate.rating
                    ? "text-amber-500 fill-amber-400"
                    : "text-zinc-300 dark:text-zinc-700"
                }`}
              />
            ))}
            <span className="ml-2 font-bold text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
              {candidate.rating ? `${candidate.rating} / 5 Stars` : "Unrated"}
            </span>
          </div>
        </div>

        {/* Candidate Notes */}
        {candidate.notes && (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Recruiter & Interview Notes
            </h4>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {candidate.notes}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Applied on{" "}
            {new Date(candidate.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Updated{" "}
            {new Date(candidate.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => onDelete(candidate)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Delete Candidate
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(candidate)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs transition-colors"
            >
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
