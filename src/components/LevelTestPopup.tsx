"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const STORAGE_KEY = "kasbah-level-popup-dismissed";
const SHOW_DELAY_MS = 2800;

type LevelTestPopupProps = {
  brand: string;
  title: string;
  text: string;
  cta: string;
  dismiss: string;
  close: string;
};

function rememberDismiss() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function LevelTestPopup({
  brand,
  title,
  text,
  cta,
  dismiss,
  close,
}: LevelTestPopupProps) {
  const pathname = usePathname();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const blocked =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/members") ||
    pathname.startsWith("/level-test") ||
    pathname.startsWith("/api");

  useEffect(() => {
    if (blocked) {
      setOpen(false);
      return;
    }

    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [blocked, pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        rememberDismiss();
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closePopup() {
    rememberDismiss();
    setOpen(false);
  }

  if (!open || blocked) return null;

  return (
    <div className="level-popup" role="presentation">
      <button
        type="button"
        className="level-popup-backdrop"
        aria-label={close}
        onClick={closePopup}
      />
      <div
        ref={dialogRef}
        className="level-popup-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="level-popup-x" aria-label={close} onClick={closePopup}>
          ×
        </button>
        <p className="level-popup-eyebrow">{brand}</p>
        <h2 id={titleId}>{title}</h2>
        <p>{text}</p>
        <div className="level-popup-actions">
          <Link className="btn btn-primary" href="/level-test" onClick={rememberDismiss}>
            {cta}
          </Link>
          <button type="button" className="btn btn-ghost" onClick={closePopup}>
            {dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
