"use client";

import { useCallback, useMemo, useState } from "react";
import type { OnboardingState } from "@/features/onboarding/types/onboarding";

export function useOnboarding(onboarding?: OnboardingState) {
  const [dismissedStep, setDismissedStep] = useState("");
  const [forcedOpenStep, setForcedOpenStep] = useState("");
  const currentStep = onboarding?.currentStep ?? "";
  const shouldOpenFromServer = onboarding?.completed === false && dismissedStep !== currentStep;
  const isOpen = useMemo(
    () => Boolean(shouldOpenFromServer || (forcedOpenStep && forcedOpenStep === currentStep)),
    [currentStep, forcedOpenStep, shouldOpenFromServer],
  );

  const open = useCallback(() => {
    setDismissedStep("");
    setForcedOpenStep(currentStep);
  }, [currentStep]);

  const close = useCallback(() => {
    setForcedOpenStep("");
    setDismissedStep(currentStep);
  }, [currentStep]);

  return {
    close,
    currentStep,
    isOpen,
    onboarding,
    open,
  };
}
