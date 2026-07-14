"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsSeriesPoint, TicketStatusCount } from "@/features/analytics/types/analytics";

const SERIES_1 = "#4f82f6"; // primary (commits / opened / created)
const SERIES_2 = "#199e70"; // secondary (merged / resolved)

const AXIS_STYLE = { fill: "#9ca3af", fontSize: 12 };

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ name: string; value: number; color: string }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#263149] bg-[#172033] px-3 py-2 text-xs shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <p className="mb-1 font-medium text-[#f8fafc]">{label ? formatShortDate(label) : ""}</p>
      {payload.map((entry) => (
        <p className="flex items-center gap-2 text-[#cbd5e1]" key={entry.name}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[#263149] text-sm text-[#8d96a6]">
      {message}
    </div>
  );
}

export function CommitActivityChart({
  series,
  total,
}: {
  series: AnalyticsSeriesPoint[];
  total: number;
}) {
  return (
    <div>
      <p className="mb-3 text-2xl font-semibold text-[#f8fafc]">{total} commits</p>
      {series.length === 0 ? (
        <EmptyChartState message="No commit history yet — sync GitHub history to see activity." />
      ) : (
        <ResponsiveContainer height={220} width="100%">
          <LineChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#202a3f" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={AXIS_STYLE}
              tickFormatter={formatShortDate}
              tickLine={false}
            />
            <YAxis allowDecimals={false} axisLine={false} tick={AXIS_STYLE} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              dataKey="count"
              dot={{ r: 3, fill: SERIES_1, strokeWidth: 0 }}
              name="Commits"
              stroke={SERIES_1}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function PullRequestThroughputChart({
  opened,
  merged,
  avgTimeToMergeHours,
}: {
  opened: AnalyticsSeriesPoint[];
  merged: AnalyticsSeriesPoint[];
  avgTimeToMergeHours: number | null;
}) {
  const merged_ = mergeSeries(opened, merged, "opened", "merged");

  return (
    <div>
      <p className="mb-3 text-sm text-[#9ca3af]">
        Avg time to merge:{" "}
        <span className="font-semibold text-[#f8fafc]">
          {avgTimeToMergeHours === null ? "—" : formatHours(avgTimeToMergeHours)}
        </span>
      </p>
      {merged_.length === 0 ? (
        <EmptyChartState message="No pull request history yet — sync GitHub history to see throughput." />
      ) : (
        <ResponsiveContainer height={220} width="100%">
          <LineChart data={merged_} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#202a3f" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={AXIS_STYLE}
              tickFormatter={formatShortDate}
              tickLine={false}
            />
            <YAxis allowDecimals={false} axisLine={false} tick={AXIS_STYLE} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Line
              dataKey="opened"
              dot={{ r: 3, fill: SERIES_1, strokeWidth: 0 }}
              name="Opened"
              stroke={SERIES_1}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="merged"
              dot={{ r: 3, fill: SERIES_2, strokeWidth: 0 }}
              name="Merged"
              stroke={SERIES_2}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function TicketFlowChart({
  created,
  resolved,
  avgCycleTimeHours,
  byStatus,
}: {
  created: AnalyticsSeriesPoint[];
  resolved: AnalyticsSeriesPoint[];
  avgCycleTimeHours: number | null;
  byStatus: TicketStatusCount[];
}) {
  const merged = mergeSeries(created, resolved, "created", "resolved");
  const maxStatusCount = Math.max(1, ...byStatus.map((s) => s.count));

  return (
    <div>
      <p className="mb-3 text-sm text-[#9ca3af]">
        Avg cycle time:{" "}
        <span className="font-semibold text-[#f8fafc]">
          {avgCycleTimeHours === null ? "—" : formatHours(avgCycleTimeHours)}
        </span>
      </p>
      {merged.length === 0 ? (
        <EmptyChartState message="No ticket history yet — sync Jira history to see flow." />
      ) : (
        <ResponsiveContainer height={220} width="100%">
          <LineChart data={merged} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#202a3f" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={AXIS_STYLE}
              tickFormatter={formatShortDate}
              tickLine={false}
            />
            <YAxis allowDecimals={false} axisLine={false} tick={AXIS_STYLE} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Line
              dataKey="created"
              dot={{ r: 3, fill: SERIES_1, strokeWidth: 0 }}
              name="Created"
              stroke={SERIES_1}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="resolved"
              dot={{ r: 3, fill: SERIES_2, strokeWidth: 0 }}
              name="Resolved"
              stroke={SERIES_2}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {byStatus.length > 0 ? (
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8d96a6]">
            By status
          </p>
          {byStatus.map((entry) => (
            <div className="flex items-center gap-3" key={entry.status}>
              <span className="w-28 shrink-0 truncate text-xs text-[#cbd5e1]">{entry.status}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#172033]">
                <div
                  className="h-full rounded-full bg-[#4f82f6]"
                  style={{ width: `${(entry.count / maxStatusCount) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs text-[#9ca3af]">{entry.count}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function mergeSeries(
  a: AnalyticsSeriesPoint[],
  b: AnalyticsSeriesPoint[],
  aKey: string,
  bKey: string,
): Array<{ date: string; [key: string]: string | number }> {
  const dates = new Set([...a.map((p) => p.date), ...b.map((p) => p.date)]);
  const aByDate = new Map(a.map((p) => [p.date, p.count]));
  const bByDate = new Map(b.map((p) => [p.date, p.count]));

  return [...dates]
    .sort()
    .map((date) => ({ date, [aKey]: aByDate.get(date) ?? 0, [bKey]: bByDate.get(date) ?? 0 }));
}

function formatHours(hours: number): string {
  if (hours < 1) {
    return "<1h";
  }

  if (hours < 48) {
    return `${Math.round(hours)}h`;
  }

  return `${Math.round(hours / 24)}d`;
}
