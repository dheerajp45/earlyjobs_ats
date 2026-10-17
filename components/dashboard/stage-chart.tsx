"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface StageDistributionItem {
  stage: string;
  label: string;
  count: number;
}

interface StageChartProps {
  data: StageDistributionItem[];
}

const STAGE_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  APPLIED: {
    label: "Applied",
    color: "#475569", // Slate 600 - sleek steel
  },
  SCREENING: {
    label: "Screening",
    color: "#f59e0b", // Amber 500 - warm golden
  },
  INTERVIEW: {
    label: "Interview",
    color: "#2563eb", // Royal Sapphire Blue
  },
  OFFER: {
    label: "Offer",
    color: "#0d9488", // Deep Emerald Teal
  },
  HIRED: {
    label: "Hired",
    color: "#16a34a", // Forest Green
  },
  REJECTED: {
    label: "Rejected",
    color: "#e11d48", // Rose Red
  },
};

export function StageChart({ data }: StageChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-zinc-50/50 rounded-xl">
        <p className="text-xs text-zinc-400">Loading chart metrics...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Hiring Pipeline Distribution
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time candidate count across all 6 recruitment stages
          </p>
        </div>
      </div>

      <div className="h-52 sm:h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 10, left: -25, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f4f4f5"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as StageDistributionItem;
                  const config = STAGE_CONFIG[item.stage] || { color: "#475569" };
                  return (
                    <div className="rounded-xl bg-zinc-900 text-white px-3.5 py-2 text-xs shadow-xl border border-zinc-800 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-zinc-300 text-[11px] mt-0.5">
                          {item.count} {item.count === 1 ? "candidate" : "candidates"}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              maxBarSize={42}
              radius={[8, 8, 2, 2]}
              minPointSize={6}
            >
              <LabelList
                dataKey="count"
                position="top"
                offset={6}
                style={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
              />
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.stage}`}
                  fill={STAGE_CONFIG[entry.stage]?.color || "#475569"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
