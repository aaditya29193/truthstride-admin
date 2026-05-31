"use client";

import { CheckCircle2, Circle, X } from "lucide-react";
import { useState } from "react";
import type { OnboardingSteps } from "@/features/onboarding/types/onboarding";

type SetupReminderCardProps = {
  setupStatus: {
    completed: boolean;
    steps: OnboardingSteps;
  };
  onResume: () => void;
};

export function SetupReminderCard({ setupStatus, onResume }: SetupReminderCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || setupStatus.completed) {
    return null;
  }

  const items = [
    {
      complete: setupStatus.steps.projectCreated,
      label: "Project",
      message: "Project setup incomplete.",
    },
    {
      complete: setupStatus.steps.jiraConnected,
      label: "Jira",
      message: "Connect Jira to start tracking ticket activity.",
    },
    {
      complete: setupStatus.steps.githubConnected,
      label: "GitHub",
      message: "Connect GitHub to start tracking engineering activity.",
    },
  ];
  const nextItem = items.find((item) => !item.complete);

  return (
    <section className="rounded-2xl border border-[#26395f] bg-[#10192a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#82a8ff]">
            Setup reminder
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal text-[#f8fafc]">
            {nextItem?.message ?? "Finish workspace setup."}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {items.map((item) => {
              const Icon = item.complete ? CheckCircle2 : Circle;

              return (
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                    item.complete
                      ? "border-[#235a42] bg-[#10251d] text-[#9ee5be]"
                      : "border-[#3b465a] bg-[#182031] text-[#b8c0cf]"
                  }`}
                  key={item.label}
                >
                  <Icon aria-hidden size={16} />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
        <button
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#263149] text-[#9ca3af] transition hover:bg-[#172033] hover:text-[#f8fafc]"
          onClick={() => setDismissed(true)}
          title="Dismiss reminder"
          type="button"
        >
          <X aria-hidden size={17} />
        </button>
      </div>
      <button
        className="mt-5 h-10 rounded-xl bg-[#4f82f6] px-4 text-sm font-medium text-white transition hover:bg-[#416fe1]"
        onClick={onResume}
        type="button"
      >
        Resume Setup
      </button>
    </section>
  );
}
