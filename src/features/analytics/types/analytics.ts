export type AnalyticsSeriesPoint = {
  date: string;
  count: number;
};

export type CommitAnalytics = {
  series: AnalyticsSeriesPoint[];
  total: number;
};

export type PullRequestAnalytics = {
  opened: AnalyticsSeriesPoint[];
  merged: AnalyticsSeriesPoint[];
  avgTimeToMergeHours: number | null;
};

export type TicketStatusCount = {
  status: string;
  count: number;
};

export type TicketAnalytics = {
  created: AnalyticsSeriesPoint[];
  resolved: AnalyticsSeriesPoint[];
  avgCycleTimeHours: number | null;
  byStatus: TicketStatusCount[];
};

export type SyncSource = "github" | "jira";

export type SyncRun = {
  id: string;
  projectId: string;
  source: string;
  status: "running" | "completed" | "failed";
  itemsSynced: number;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
};
