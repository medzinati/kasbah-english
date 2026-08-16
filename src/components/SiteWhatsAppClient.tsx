"use client";

import { usePathname } from "next/navigation";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

type Props = {
  label: string;
  prefill: string;
  number?: string;
};

export function SiteWhatsAppClient({ label, prefill, number }: Props) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/members")) {
    return null;
  }
  return <WhatsAppFloat label={label} prefill={prefill} number={number} />;
}
