"use client";

import { useCallback, useState } from "react";
import { useFullscreen } from "../hooks/use-fullscreen";
import { useTotemTimer } from "../hooks/use-totem-timer";
import { submitEvaluation } from "../actions/submit-evaluation";
import { WelcomeScreen } from "./welcome-screen";
import { EvaluationForm } from "./evaluation-form";
import { ThankYouScreen } from "./thank-you-screen";
import { TotemProgress } from "./totem-progress";

type Step = "welcome" | "evaluating" | "submitting" | "thank-you";

interface TotemScreenProps {
  unidadeId: string;
  setorId?: string;
  unidadeNome?: string;
  canal?: string;
}

export function TotemScreen({
  unidadeId,
  setorId,
  unidadeNome,
  canal = "totem",
}: TotemScreenProps) {
  const [step, setStep] = useState<Step>("welcome");

  useFullscreen();

  const handleReset = useCallback(() => {
    setStep("welcome");
  }, []);

  const timer = useTotemTimer({
    idleTimeoutMs: 60000,
    postSubmitTimeoutMs: 10000,
    onReset: handleReset,
  });

  const handleStart = useCallback(() => {
    setStep("evaluating");
    timer.onStartEvaluation();
  }, [timer]);

  const handleSubmit = useCallback(
    async (nota: string, comentario: string | null) => {
      setStep("submitting");
      timer.onPostSubmit();

      const formData = new FormData();
      formData.set("unidadeId", unidadeId);
      if (setorId) formData.set("setorId", setorId);
      formData.set("nota", nota);
      formData.set("canal", canal);
      formData.set("sessionId", crypto.randomUUID());
      if (comentario) formData.set("comentario", comentario);

      const result = await submitEvaluation(formData);

      if (result.success) {
        setStep("thank-you");
      } else {
        setStep("thank-you");
      }
    },
    [unidadeId, setorId, canal, timer]
  );

  const handleComplete = useCallback(() => {
    handleReset();
  }, [handleReset]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6 md:p-12 touch-manipulation"
      onTouchMove={timer.onUserActivity}
      onClick={timer.onUserActivity}
      onKeyDown={timer.onUserActivity}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground">
        Pular para conteudo
      </a>

      <div className="absolute top-6 left-6">
        <TotemProgress currentStep={step} />
      </div>

      <div id="main-content" className="w-full max-w-3xl">
        {step === "welcome" && (
          <WelcomeScreen unidadeNome={unidadeNome} onStart={handleStart} />
        )}

        {step === "evaluating" && (
          <EvaluationForm
            onRate={() => {}}
            onSubmit={handleSubmit}
          />
        )}

        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center gap-6 text-center" role="status">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-2xl text-muted-foreground">Enviando sua avaliacao...</p>
          </div>
        )}

        {step === "thank-you" && (
          <ThankYouScreen onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
