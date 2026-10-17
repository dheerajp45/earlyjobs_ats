"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  candidateName: string;
  candidateId: string;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  candidateName,
  candidateId,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(candidateId);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Candidate"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400" />
          <p className="text-sm">
            Are you sure you want to permanently delete candidate{" "}
            <span className="font-semibold text-rose-950 dark:text-rose-100">
              "{candidateName}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Permanently
          </button>
        </div>
      </div>
    </Modal>
  );
}
