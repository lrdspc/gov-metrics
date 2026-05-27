"use client";

import { useEffect, useRef, useCallback } from "react";

type TimerState = "idle" | "active" | "post-submit" | "resetting";

interface UseTotemTimerOptions {
  idleTimeoutMs?: number;
  postSubmitTimeoutMs?: number;
  onReset: () => void;
}

export function useTotemTimer({
  idleTimeoutMs = 60000,
  postSubmitTimeoutMs = 10000,
  onReset,
}: UseTotemTimerOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<TimerState>("idle");

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number, callback: () => void) => {
      clear();
      timerRef.current = setTimeout(callback, duration);
    },
    [clear]
  );

  const resetIdleTimer = useCallback(() => {
    if (stateRef.current === "idle") {
      startTimer(idleTimeoutMs, () => {
        stateRef.current = "resetting";
        onReset();
      });
    }
  }, [idleTimeoutMs, startTimer, onReset]);

  const onStartEvaluation = useCallback(() => {
    stateRef.current = "active";
    clear();
  }, [clear]);

  const onPostSubmit = useCallback(() => {
    stateRef.current = "post-submit";
    startTimer(postSubmitTimeoutMs, () => {
      stateRef.current = "resetting";
      onReset();
    });
  }, [postSubmitTimeoutMs, startTimer, onReset]);

  const onUserActivity = useCallback(() => {
    if (stateRef.current === "idle") {
      resetIdleTimer();
    }
  }, [resetIdleTimer]);

  useEffect(() => {
    resetIdleTimer();
    return clear;
  }, [resetIdleTimer, clear]);

  return {
    onStartEvaluation,
    onPostSubmit,
    onUserActivity,
    clear,
  };
}
