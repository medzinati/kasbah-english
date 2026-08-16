"use client";

import { SessionProvider } from "next-auth/react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ScrollReveal />
    </SessionProvider>
  );
}
