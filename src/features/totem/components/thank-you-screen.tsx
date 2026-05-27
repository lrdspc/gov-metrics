"use client";

import { useEffect, useState } from "react";

interface ThankYouScreenProps {
  onComplete: () => void;
}

export function ThankYouScreen({ onComplete }: ThankYouScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 text-center transition-all duration-700 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <span className="text-8xl md:text-9xl">🎉</span>

      <h1 className="text-4xl md:text-6xl font-bold">
        Obrigado pela sua avaliacao!
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
        Sua opiniao e muito importante para melhorarmos nossos servicos
      </p>

      <p className="text-base text-muted-foreground/60">
        Nova avaliacao em instantes...
      </p>
    </div>
  );
}
