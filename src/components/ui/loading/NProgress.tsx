"use client";

import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect, useRef } from "react";

export function NProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isConfigured = useRef(false);

  useEffect(() => {
    if (!isConfigured.current) {
      NProgress.configure({
        showSpinner: false,
        trickleSpeed: 200,
        minimum: 0.08,
        easing: "ease",
        speed: 500,
      });
      isConfigured.current = true;
    }
  }, []);

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
