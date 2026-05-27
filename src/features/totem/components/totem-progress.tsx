"use client";

import { cn } from "@/lib/utils";

interface TotemProgressProps {
  currentStep: string;
}

const steps = [
  { key: "welcome", label: "Inicio" },
  { key: "evaluating", label: "Avaliacao" },
  { key: "submitting", label: "Envio" },
  { key: "thank-you", label: "Concluido" },
];

export function TotemProgress({ currentStep }: TotemProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors",
              i <= currentIndex
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {i + 1}
          </div>
          <span
            className={cn(
              "text-sm hidden md:inline transition-colors",
              i <= currentIndex ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-0.5 mx-1 transition-colors",
                i < currentIndex ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
