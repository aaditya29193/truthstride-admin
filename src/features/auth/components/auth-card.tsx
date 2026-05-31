"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Eye, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { bootstrapQueryKey } from "@/features/app/hooks/use-bootstrap";
import { ApiError } from "@/lib/api/http-client";
import { getAuthToken } from "@/features/auth/utils/auth-response";
import { saveAccessToken } from "@/features/auth/utils/token-storage";
import { login, signup } from "@/features/auth/api/auth-api";
import { OnboardingModal } from "@/features/onboarding/components/onboarding-modal";
import type { OnboardingState } from "@/features/onboarding/types/onboarding";
import type { AuthPageContent } from "@/features/auth/types/auth-page";

type AuthCardProps = {
  content: AuthPageContent;
};

type NotificationState = {
  message: string;
  type: "error" | "success";
} | null;

export function AuthCard({ content }: AuthCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isSignup = content.mode === "signup";
  const [notification, setNotification] = useState<NotificationState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const organizationName = String(formData.get("organizationName") ?? "").trim();
    const organizationSlug = String(formData.get("organizationSlug") ?? "").trim();

    try {
      validateAuthForm({ email, isSignup, name, organizationName, organizationSlug, password });

      const response = isSignup
        ? await signup({ email, name, organizationName, organizationSlug, password })
        : await login({ email, password });

      const token = getAuthToken(response);

      if (token) {
        saveAccessToken(token);
      }

      queryClient.setQueryData(bootstrapQueryKey, {
        onboarding: response.onboarding,
        organization: response.organization,
        user: response.user,
      });

      if (!response.onboarding.completed) {
        setNotification({
          message: isSignup
            ? "Account created. You can finish setup now or skip to the dashboard."
            : "Signed in. You can finish setup now or skip to the dashboard.",
          type: "success",
        });
        setOnboarding(response.onboarding);
        return;
      }

      setNotification({
        message: "Success. Taking you to your dashboard.",
        type: "success",
      });

      router.push(response.onboarding.redirectTo || "/dashboard");
    } catch (error) {
      setNotification({
        message: getSubmitErrorMessage(error),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="w-full rounded-2xl border border-[#202b42] bg-[#111827] px-8 py-9 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-9 sm:py-10">
        <div className="mb-8">
          <h1 className="max-w-[330px] text-[28px] font-bold leading-[1.18] tracking-normal text-[#f4f7fb] sm:text-[30px]">
            {content.title}
          </h1>
          <p className="mt-3 max-w-[330px] text-[15px] leading-6 text-[#9ca3af]">
            {content.description}
          </p>
        </div>

        {notification ? <AuthNotification notification={notification} /> : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
        {isSignup ? (
          <>
            <label className="block">
              <span className="mb-2.5 block text-[15px] font-medium text-[#f1f5f9]">
                Name
              </span>
              <input
                className="h-[43px] w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none transition placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
                name="name"
                placeholder="Your name"
                type="text"
              />
            </label>

            <label className="block">
              <span className="mb-2.5 block text-[15px] font-medium text-[#f1f5f9]">
                Organization name
              </span>
              <input
                className="h-[43px] w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none transition placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
                name="organizationName"
                placeholder="Acme Construction"
                type="text"
              />
            </label>

            <label className="block">
              <span className="mb-2.5 block text-[15px] font-medium text-[#f1f5f9]">
                Organization slug
              </span>
              <input
                className="h-[43px] w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none transition placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
                name="organizationSlug"
                placeholder="acme"
                type="text"
              />
            </label>
          </>
        ) : null}

        <label className="block">
          <span className="mb-2.5 block text-[15px] font-medium text-[#f1f5f9]">
            {content.emailLabel}
          </span>
          <input
            className="h-[43px] w-full rounded-xl border border-[#243047] bg-[#172033] px-3.5 text-[15px] text-[#f8fafc] outline-none transition placeholder:text-[#8d96a6] focus:border-[#4f82f6] focus:ring-4 focus:ring-[#4f82f6]/15"
            name="email"
            placeholder="you@company.com"
            type="email"
          />
        </label>

        <label className="block">
          <span className="mb-2.5 block text-[15px] font-medium text-[#f1f5f9]">
            Password
          </span>
          <span className="flex h-[43px] items-center rounded-xl border border-[#243047] bg-[#172033] px-3.5 transition focus-within:border-[#4f82f6] focus-within:ring-4 focus-within:ring-[#4f82f6]/15">
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#f8fafc] outline-none placeholder:text-[#8d96a6]"
              name="password"
              placeholder={content.passwordPlaceholder}
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="grid h-8 w-8 place-items-center rounded-lg text-[#8d96a6] transition hover:bg-[#202b42] hover:text-[#f8fafc]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              <Eye aria-hidden size={17} />
            </button>
          </span>
        </label>

        <button
          className="mt-1 flex h-[41px] w-full items-center justify-center gap-2 rounded-xl bg-[#4f82f6] px-4 text-[15px] font-medium text-white shadow-[0_14px_28px_rgba(79,130,246,0.2)] transition hover:bg-[#416fe1] focus:outline-none focus:ring-4 focus:ring-[#4f82f6]/25 disabled:cursor-not-allowed disabled:bg-[#3b5fa9] disabled:text-white/70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="animate-spin" size={17} />
              Please wait
            </>
          ) : (
            content.submitLabel
          )}
        </button>
        </form>

        <p className="mt-7 text-center text-[15px] text-[#9ca3af]">
          {content.footerText}{" "}
          <Link className="font-medium text-[#5f8dff] hover:text-[#82a8ff]" href={content.footerHref}>
            {content.footerAction}
          </Link>
        </p>
      </section>
      {onboarding ? (
        <OnboardingModal
          onboarding={onboarding}
          onClose={() => {
            setOnboarding(null);
            router.push("/dashboard");
          }}
          onComplete={() => router.push("/dashboard")}
        />
      ) : null}
    </>
  );
}

function AuthNotification({ notification }: { notification: NonNullable<NotificationState> }) {
  const isError = notification.type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`mb-5 flex gap-3 rounded-xl border px-3.5 py-3 text-sm leading-5 ${
        isError
          ? "border-[#71333f] bg-[#2a131a] text-[#ffb4c1]"
          : "border-[#235a42] bg-[#10251d] text-[#9ee5be]"
      }`}
      role="status"
    >
      <Icon aria-hidden className="mt-0.5 shrink-0" size={17} />
      <span>{notification.message}</span>
    </div>
  );
}

function validateAuthForm(input: {
  email: string;
  isSignup: boolean;
  name: string;
  organizationName: string;
  organizationSlug: string;
  password: string;
}) {
  if (!input.email) {
    throw new Error("Please enter your email address.");
  }

  if (!input.password) {
    throw new Error("Please enter your password.");
  }

  if (!input.isSignup) {
    return;
  }

  if (!input.name) {
    throw new Error("Please enter your name.");
  }

  if (!input.organizationName) {
    throw new Error("Please enter your organization name.");
  }

  if (!input.organizationSlug) {
    throw new Error("Please enter your organization slug.");
  }
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
