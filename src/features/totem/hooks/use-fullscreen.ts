"use client";

import { useEffect } from "react";

export function useFullscreen() {
  useEffect(() => {
    const el = document.documentElement;

    function enterFullscreen() {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch(() => {});
      }
    }

    document.addEventListener("click", enterFullscreen, { once: true });

    const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
    if (orientation?.lock) {
      orientation.lock("portrait").catch(() => {});
    }

    return () => {
      document.removeEventListener("click", enterFullscreen);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);
}
