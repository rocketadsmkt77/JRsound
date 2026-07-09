"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/client/stats";

/** Conta uma visita a cada página aberta (menos o painel admin). */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const page = pathname === "/" ? "home" : pathname.replace(/^\/+|\/+$/g, "");
    trackPageView(page);
  }, [pathname]);

  return null;
}
