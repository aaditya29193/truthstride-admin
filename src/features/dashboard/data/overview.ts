import {
  AlertTriangle,
  CheckCircle2,
  CircleDotDashed,
  GitPullRequest,
  ShieldAlert,
} from "lucide-react";

export const overviewStats = [
  {
    label: "In Progress",
    value: "12",
    note: "+3 since yesterday",
    tone: "blue",
  },
  {
    label: "In Review",
    value: "5",
    note: "2 stale (>48h)",
    tone: "amber",
  },
  {
    label: "Merged This Week",
    value: "23",
    note: "+18% vs last week",
    tone: "emerald",
  },
  {
    label: "Blocked",
    value: "3",
    note: "Needs attention",
    tone: "rose",
  },
];

export const alerts = [
  {
    description: "BT-1, BT-7, BT-12 are waiting on reviewers",
    icon: GitPullRequest,
    title: "3 PRs pending review for >48 hours",
  },
  {
    description: "BT-22, BT-30 closed in Jira but no PR detected in Git",
    icon: CheckCircle2,
    title: "2 tickets marked done but no merge found",
  },
  {
    description: "Created 6 hours ago by Daniel Kim",
    icon: ShieldAlert,
    title: "Branch 'feat/payments' has no linked ticket",
  },
];

export const recentActivity = [
  {
    actor: "Sara Chen",
    icon: GitPullRequest,
    meta: "BT-1",
    time: "12 min ago",
    title: "PR opened: Fix login redirect loop",
  },
  {
    actor: "Miguel Ortiz",
    icon: CircleDotDashed,
    meta: "BT-2",
    time: "34 min ago",
    title: "Branch created: feat/billing-webhooks",
  },
  {
    actor: "Priya Patel",
    icon: AlertTriangle,
    meta: "BT-14",
    time: "1 hr ago",
    title: "Ticket moved to In Progress",
  },
  {
    actor: "Daniel Kim",
    icon: CheckCircle2,
    meta: "BT-9",
    time: "2 hr ago",
    title: "PR merged: Refactor auth middleware",
  },
  {
    actor: "Alex Rivera",
    icon: GitPullRequest,
    meta: "BT-7",
    time: "3 hr ago",
    title: "PR opened: Add dark mode toggle",
  },
  {
    actor: "Sara Chen",
    icon: AlertTriangle,
    meta: "BT-5",
    time: "4 hr ago",
    title: "Ticket moved to In Review",
  },
];
