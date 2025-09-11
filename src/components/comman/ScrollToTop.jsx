"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ScrollToTop() {
  const router = useRouter();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"; // Disable default behavior
    }

    const handleRouteChange = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // Force scroll to top
      }, 50); // Slight delay to ensure page content is loaded
    };

    // Trigger on initial load
    handleRouteChange();

    // Trigger on navigation
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return null;
}
