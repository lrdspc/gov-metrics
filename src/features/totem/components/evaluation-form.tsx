"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EvaluationFormProps {
  onRate: (nota: string) => void;
  onSubmit: (nota: string, comentario: string | null) => void;
}

const opcoes = [
  { value: "excellent", label: "Excelente", emoji: "😊", color: "bg-green-500 hover:bg-green-600" },
  { value: "good", label: "Bom", emoji: "🙂", color: "bg-blue-500 hover:bg-blue-600" },
  { value: "regular", label: "Regular", emoji: "😐", color: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "bad", label: "Ruim", emoji: "😞", color: "bg-red-500 hover:bg-red-600" },
] as const;

export function EvaluationForm({ onRate, onSubmit }: EvaluationFormProps) {
  const [step, setStep] = useState<"rate" | "comment">("rate");
  const [nota, setNota] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  function handleRate(value: string) {
    setNota(value);
    setStep("comment");
  }

  function handleSubmit() {
    if (nota) onSubmit(nota, comentario.trim() || null);
  }

  function handleSkip() {
    if (nota) onSubmit(nota, null);
  }

  if (step === "rate") {
    return (
      <div
        className={`flex flex-col items-center gap-10 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          Como foi seu atendimento?
        </h2>

        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {opcoes.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => handleRate(opt.value)}
              className={`h-36 text-2xl md:h-44 md:text-3xl rounded-2xl font-bold flex flex-col items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform touch-friendly ${opt.color} text-white border-none`}
            >
              <span className="text-5xl md:text-6xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Quer deixar um comentario?
      </h2>

      <p className="text-xl text-muted-foreground text-center">
        Conte-nos sobre sua experiencia (opcional)
      </p>

      <div className="w-full space-y-2">
        <Label htmlFor="comentario" className="sr-only">
          Seu comentario
        </Label>
        <Textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Digite seu comentario aqui..."
          className="min-h-[120px] text-xl p-4 touch-friendly"
          autoFocus
        />
      </div>

      <div className="flex gap-4 w-full">
        <Button
          onClick={handleSkip}
          variant="outline"
          className="flex-1 h-20 text-xl rounded-xl touch-friendly"
        >
          Pular
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-20 text-xl rounded-xl touch-friendly"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
