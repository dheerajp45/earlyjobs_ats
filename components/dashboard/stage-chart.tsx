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

const STAGE_COLORS: Record<string, string> = {
  APPLIED: "#0ea5e9", // Sky Blue
  SCREENING: "#f59e0b", // Amber
  INTERVIEW: "#3b82f6", // Blue
  OFFER: "#14b8a6", // Teal
  HIRED: "#10b981", // Emerald
  REJECTED: "#f43f5e", // Rose
};

export function StageChart({ data }: StageChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl">
        <p className="text-xs text-zinc-400">Loading chart metrics...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Hiring Pipeline Distribution
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time candidate count across all 6 recruitment stages
          </p>
        </div>
      </div>

      <div className="h-52 sm:h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
              className="dark:stroke-zinc-800"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as StageDistributionItem;
                  return (
                    <div className="rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-2 text-xs shadow-lg border border-zinc-800">
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-zinc-300 dark:text-zinc-600 mt-0.5">
                        {item.count} {item.count === 1 ? "candidate" : "candidates"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} minPointSize={4}>
              <LabelList
                dataKey="count"
                position="top"
                offset={6}
                style={{ fontSize: 11, fontWeight: 700, fill: "#71717a" }}
              />
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.stage}`}
                  fill={STAGE_COLORS[entry.stage] || "#0ea5e9"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
