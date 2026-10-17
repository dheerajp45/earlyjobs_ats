"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, NavTab } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { StageChart } from "@/components/dashboard/stage-chart";
import { RecentCandidates } from "@/components/dashboard/recent-candidates";
import { CandidateFilters } from "@/components/candidates/candidate-filters";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import {
  CandidateFormModal,
  CandidateFormData,
} from "@/components/candidates/candidate-form-modal";
import {
  CandidateDetailModal,
  CandidateDetailData,
} from "@/components/candidates/candidate-detail-modal";
import { DeleteConfirmModal } from "@/components/candidates/delete-confirm-modal";
import { CandidateStage } from "@/lib/validations/candidate";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface DashboardMetricsData {
  totalCandidates: number;
  activeCandidates: number;
  stageCounts: Record<CandidateStage, number>;
  stageDistribution: Array<{ stage: string; label: string; count: number }>;
  recentCandidates: CandidateDetailData[];
  distinctPositionsCount: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [candidates, setCandidates] = useState<CandidateDetailData[]>([]);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetricsData | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [positionsList, setPositionsList] = useState<string[]>([]);

  // Modals & Active Records
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] =
    useState<CandidateFormData | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [candidateToView, setCandidateToView] =
    useState<CandidateDetailData | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] =
    useState<CandidateDetailData | null>(null);

  // UI status
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Fetch candidates from /api/candidates
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (stageFilter) params.set("stage", stageFilter);
      if (positionFilter) params.set("position", positionFilter);
      params.set("limit", "100");

      const res = await fetch(`/api/candidates?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch candidates.");
      const data = await res.json();
      setCandidates(data.candidates);

      // Extract unique positions for filter dropdown
      if (!positionFilter && !search && !stageFilter) {
        const uniquePos: string[] = Array.from(
          new Set(data.candidates.map((c: any) => c.position))
        );
        setPositionsList(uniquePos);
      }
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to load candidate list");
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, positionFilter]);

  // Fetch dashboard metrics from /api/dashboard
  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard metrics");
      const data = await res.json();
      setDashboardMetrics(data);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
    loadDashboard();
  }, [loadCandidates, loadDashboard]);

  // Save (Create or Update) Candidate
  const handleSaveCandidate = async (formData: CandidateFormData) => {
    const isEdit = Boolean(formData.id);
    const url = isEdit
      ? `/api/candidates/${formData.id}`
      : "/api/candidates";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw data;
    }

    showNotification(
      "success",
      isEdit
        ? `Candidate "${data.name}" updated successfully.`
        : `Candidate "${data.name}" created successfully.`
    );

    loadCandidates();
    loadDashboard();
  };

  // Update Hiring Stage
  const handleStageChange = async (id: string, newStage: CandidateStage) => {
    try {
      const res = await fetch(`/api/candidates/${id}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update stage");
      }

      const updated = await res.json();
      showNotification(
        "success",
        `Stage for "${updated.name}" changed to ${newStage}.`
      );

      // Optimistically update list
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
      );
      if (candidateToView?.id === id) {
        setCandidateToView((prev) =>
          prev ? { ...prev, stage: newStage } : null
        );
      }

      loadDashboard();
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (id: string) => {
    const res = await fetch(`/api/candidates/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete candidate");
    }

    showNotification("success", "Candidate permanently deleted from database.");
    if (candidateToView?.id === id) {
      setIsDetailOpen(false);
      setCandidateToView(null);
    }

    loadCandidates();
    loadDashboard();
  };

  // Bulk Stage Update
  const handleBulkStageChange = async (
    ids: string[],
    stage: CandidateStage
  ) => {
    try {
      const res = await fetch("/api/candidates/bulk-stage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, stage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update candidates in bulk.");
      }

      const data = await res.json();
      showNotification(
        "success",
        `Updated ${data.count} candidates to ${stage}`
      );
      loadCandidates();
      loadDashboard();
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to execute bulk action");
    }
  };

  // Export filtered candidates to CSV
  const handleExportCSV = () => {
    if (candidates.length === 0) {
      showNotification("error", "No candidates available to export.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Position",
      "Experience (Years)",
      "Scorecard Rating",
      "Stage",
      "Resume URL",
      "Notes",
      "Applied Date",
    ];

    const rows = candidates.map((c) => [
      c.id,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      `"${(c.position || "").replace(/"/g, '""')}"`,
      c.experience ?? "",
      c.rating ? `${c.rating}/5` : "",
      c.stage,
      `"${(c.resumeUrl || "").replace(/"/g, '""')}"`,
      `"${(c.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `earlyjobs-candidates-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(
      "success",
      `Exported ${candidates.length} candidate(s) to CSV spreadsheet`
    );
  };

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="hidden sm:block shrink-0 h-full">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewCandidate={() => {
            setCandidateToEdit(null);
            setIsFormOpen(true);
          }}
        />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewCandidate={() => {
            setCandidateToEdit(null);
            setIsFormOpen(true);
          }}
          candidateCount={candidates.length}
        />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
                notification.type === "success"
                  ? "bg-emerald-900/90 text-emerald-100 border-emerald-700 backdrop-blur-md"
                  : "bg-rose-900/90 text-rose-100 border-rose-700 backdrop-blur-md"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-zinc-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Tabs Content */}
        <main className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto max-w-7xl mx-auto w-full pb-20 sm:pb-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Metric Cards */}
              <MetricCards
                totalCandidates={dashboardMetrics?.totalCandidates ?? 0}
                activeCandidates={dashboardMetrics?.activeCandidates ?? 0}
                hiredCount={dashboardMetrics?.stageCounts?.HIRED ?? 0}
                distinctPositionsCount={
                  dashboardMetrics?.distinctPositionsCount ?? 0
                }
              />

              {/* Chart & Recent Applicants Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StageChart
                  data={dashboardMetrics?.stageDistribution || []}
                />
                <RecentCandidates
                  candidates={dashboardMetrics?.recentCandidates || []}
                  onView={(c) => {
                    setCandidateToView(c);
                    setIsDetailOpen(true);
                  }}
                  onViewAll={() => setActiveTab("candidates")}
                />
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search & Filters */}
              <CandidateFilters
                search={search}
                stage={stageFilter}
                position={positionFilter}
                positionsList={positionsList}
                onSearchChange={setSearch}
                onStageChange={setStageFilter}
                onPositionChange={setPositionFilter}
                onClearFilters={() => {
                  setSearch("");
                  setStageFilter("");
                  setPositionFilter("");
                }}
                onExportCSV={handleExportCSV}
                totalResults={candidates.length}
              />

              {/* Candidate Table */}
              <CandidateTable
                candidates={candidates}
                loading={loading}
                onView={(c) => {
                  setCandidateToView(c);
                  setIsDetailOpen(true);
                }}
                onEdit={(c) => {
                  setCandidateToEdit(c);
                  setIsFormOpen(true);
                }}
                onDelete={(c) => {
                  setCandidateToDelete(c);
                  setIsDeleteOpen(true);
                }}
                onStageChange={handleStageChange}
                onBulkStageChange={handleBulkStageChange}
              />
            </div>
          )}

          {activeTab === "pipeline" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Recruitment Funnel
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Track and advance candidates across the 6 hiring stages
                  </p>
                </div>
              </div>

              {/* Kanban Pipeline Board */}
              <PipelineBoard
                candidates={candidates}
                loading={loading}
                onView={(c) => {
                  setCandidateToView(c);
                  setIsDetailOpen(true);
                }}
                onStageChange={handleStageChange}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CandidateFormModal
        isOpen={isFormOpen}
        candidateToEdit={candidateToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setCandidateToEdit(null);
        }}
        onSubmit={handleSaveCandidate}
      />

      <CandidateDetailModal
        isOpen={isDetailOpen}
        candidate={candidateToView}
        onClose={() => {
          setIsDetailOpen(false);
          setCandidateToView(null);
        }}
        onEdit={(c) => {
          setIsDetailOpen(false);
          setCandidateToEdit(c);
          setIsFormOpen(true);
        }}
        onDelete={(c) => {
          setCandidateToDelete(c);
          setIsDeleteOpen(true);
        }}
        onStageChange={handleStageChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        candidateName={candidateToDelete?.name || ""}
        candidateId={candidateToDelete?.id || ""}
        onClose={() => {
          setIsDeleteOpen(false);
          setCandidateToDelete(null);
        }}
        onConfirm={handleDeleteCandidate}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        candidateCount={candidates.length}
      />
    </div>
  );
}
