"use client";

import { useEffect } from "react";

/** Registers the service worker. Renders nothing — mount once in the root layout. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // Register after load so it never competes with the initial page load for bandwidth.
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal — the app works perfectly well without the service worker,
        // it just loses offline/installable support.
      });
    });
  }, []);

  return null;
}
