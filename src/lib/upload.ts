import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WebP.");
  }
  if (file.size > 4.5 * 1024 * 1024) {
    throw new Error("حجم الصورة كبير جدًا (الحد 4.5MB).");
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(`uploads/${name}`, bytes, {
      access: "public",
      contentType: file.type,
      token,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
