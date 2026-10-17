"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { CandidateStage } from "@/lib/validations/candidate";
import { Loader2, AlertCircle } from "lucide-react";

export interface CandidateFormData {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  position: string;
  experience?: number | null;
  resumeUrl?: string | null;
  stage: CandidateStage;
  notes?: string | null;
}

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateToEdit?: CandidateFormData | null;
  onSubmit: (data: CandidateFormData) => Promise<void>;
}

const STAGES: { value: CandidateStage; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export function CandidateFormModal({
  isOpen,
  onClose,
  candidateToEdit,
  onSubmit,
}: CandidateFormModalProps) {
  const [formData, setFormData] = useState<CandidateFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: 0,
    resumeUrl: "",
    stage: "APPLIED",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (candidateToEdit) {
      setFormData({
        id: candidateToEdit.id,
        name: candidateToEdit.name || "",
        email: candidateToEdit.email || "",
        phone: candidateToEdit.phone || "",
        position: candidateToEdit.position || "",
        experience: candidateToEdit.experience ?? 0,
        resumeUrl: candidateToEdit.resumeUrl || "",
        stage: candidateToEdit.stage || "APPLIED",
        notes: candidateToEdit.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: 0,
        resumeUrl: "",
        stage: "APPLIED",
        notes: "",
      });
    }
    setFieldErrors({});
    setGeneralError(null);
  }, [candidateToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setGeneralError(err.message || "Failed to save candidate.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidateToEdit ? "Edit Candidate" : "Create New Candidate"}
      description={
        candidateToEdit
          ? "Update the details and recruitment status for this applicant."
          : "Add a new candidate profile to the applicant tracking pipeline."
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {fieldErrors.name && (
              <p className="text-xs text-rose-500">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="alex.rivera@example.com"
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {fieldErrors.email && (
              <p className="text-xs text-rose-500">{fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Job Position / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {fieldErrors.position && (
              <p className="text-xs text-rose-500">{fieldErrors.position[0]}</p>
            )}
          </div>

          {/* Stage */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Hiring Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stage: e.target.value as CandidateStage,
                })
              }
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 (555) 234-5678"
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {fieldErrors.phone && (
              <p className="text-xs text-rose-500">{fieldErrors.phone[0]}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience ?? 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            {fieldErrors.experience && (
              <p className="text-xs text-rose-500">
                {fieldErrors.experience[0]}
              </p>
            )}
          </div>
        </div>

        {/* Resume URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Resume / Portfolio URL (Optional)
          </label>
          <input
            type="url"
            value={formData.resumeUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, resumeUrl: e.target.value })
            }
            placeholder="https://example.com/resume.pdf"
            className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {fieldErrors.resumeUrl && (
            <p className="text-xs text-rose-500">{fieldErrors.resumeUrl[0]}</p>
          )}
        </div>

        {/* Recruiter Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Internal Notes / Feedback
          </label>
          <textarea
            rows={3}
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Screening interview feedback, salary expectation, technical notes..."
            className="w-full px-3.5 py-2 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {candidateToEdit ? "Save Changes" : "Create Candidate"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
