import { useQuery } from "@tanstack/react-query";
import {
  getCommitAnalytics,
  getPullRequestAnalytics,
  getTicketAnalytics,
} from "@/features/analytics/api/analytics-api";

export const commitAnalyticsQueryKey = (projectId: string, days: number) =>
  ["analytics", "commits", projectId, days] as const;

export const pullRequestAnalyticsQueryKey = (projectId: string, days: number) =>
  ["analytics", "pull-requests", projectId, days] as const;

export const ticketAnalyticsQueryKey = (projectId: string, days: number) =>
  ["analytics", "tickets", projectId, days] as const;

export function useCommitAnalytics(projectId: string | undefined, days: number) {
  return useQuery({
    enabled: Boolean(projectId),
    queryFn: () => getCommitAnalytics(projectId as string, days),
    queryKey: commitAnalyticsQueryKey(projectId ?? "", days),
    retry: false,
  });
}

export function usePullRequestAnalytics(projectId: string | undefined, days: number) {
  return useQuery({
    enabled: Boolean(projectId),
    queryFn: () => getPullRequestAnalytics(projectId as string, days),
    queryKey: pullRequestAnalyticsQueryKey(projectId ?? "", days),
    retry: false,
  });
}

export function useTicketAnalytics(projectId: string | undefined, days: number) {
  return useQuery({
    enabled: Boolean(projectId),
    queryFn: () => getTicketAnalytics(projectId as string, days),
    queryKey: ticketAnalyticsQueryKey(projectId ?? "", days),
    retry: false,
  });
}
