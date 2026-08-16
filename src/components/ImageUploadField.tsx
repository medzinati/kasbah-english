"use client";

import { useState } from "react";

export function ImageUploadField({
  name = "imageUrl",
  label = "صورة المحتوى",
  defaultValue = "",
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.error || "تعذّر الرفع.");
        return;
      }
      setUrl(json.url);
    } catch {
      setError("مشكلة في الشبكة أثناء الرفع.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-upload-field">
      <label>
        {label}
        <input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/images/news/founding.png أو ارفع ملفًا"
          dir="ltr"
        />
      </label>
      <label className="image-upload-file">
        {busy ? "جاري الرفع…" : "رفع صورة من الجهاز"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={busy}
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
      </label>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="image-upload-preview" src={url} alt="" />
      ) : null}
      {error ? <p className="form-status is-error">{error}</p> : null}
    </div>
  );
}
