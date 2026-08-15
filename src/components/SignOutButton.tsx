"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn-ghost dark" onClick={() => signOut({ callbackUrl: "/" })}>
      {label}
    </button>
  );
}
