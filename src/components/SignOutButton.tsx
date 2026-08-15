"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button type="button" className="btn btn-ghost dark" onClick={() => signOut({ callbackUrl: "/" })}>
      خروج
    </button>
  );
}
