"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  unidadeNome?: string;
  onStart: () => void;
}

export function WelcomeScreen({ unidadeNome, onStart }: WelcomeScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-12 text-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-4">
        <h1 className="totem-title text-5xl md:text-7xl font-bold tracking-tight">
          {unidadeNome || "Servico Publico"}
        </h1>
        <p className="totem-text text-2xl md:text-3xl text-muted-foreground max-w-2xl">
          Sua opiniao ajuda a melhorar o atendimento para todos
        </p>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="h-28 w-80 text-3xl md:h-36 md:w-96 md:text-4xl rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-transform touch-friendly"
      >
        Avaliar Atendimento
      </Button>

      <p className="text-lg text-muted-foreground">
        Toque na tela para comecar
      </p>
    </div>
  );
}
