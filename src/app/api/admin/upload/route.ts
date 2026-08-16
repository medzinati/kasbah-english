import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "لم يتم اختيار ملف." }, { status: 400 });
    }
    const url = await saveUploadedImage(file);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذّر رفع الصورة.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
