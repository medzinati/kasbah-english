import nodemailer from "nodemailer";
import { getSiteUrl } from "@/lib/site-url";

type WelcomeMailInput = {
  to: string;
  name: string;
  tempPassword: string;
};

type ExistingMemberMailInput = {
  to: string;
  name: string;
};

type ResetMailInput = {
  to: string;
  name: string;
  resetUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function isMailConfigured() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.CONTACT_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  return Boolean(user?.trim() && pass?.trim());
}

async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.CONTACT_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return {
      sent: false,
      error: "Email not configured (set GMAIL_APP_PASSWORD or SMTP_PASS).",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"قصبة إنجليش | Kasbah English" <${user}>`,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return { sent: true };
  } catch (error) {
    console.error("Mail error", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Failed to send email.",
    };
  }
}

function nextStepsBlock(base: string) {
  return {
    text: [
      "خطوات مفيدة بعد الدخول:",
      `- مساحة الأعضاء: ${base}/members`,
      `- اختبار المستوى: ${base}/level-test`,
      `- الدروس المجانية: ${base}/courses`,
      `- الامتحانات: ${base}/exams`,
    ].join("\n"),
    html: `
      <p style="margin:16px 0 8px"><strong>خطوات مفيدة بعد الدخول:</strong></p>
      <ul style="padding-inline-start:18px;margin:0 0 16px">
        <li><a href="${base}/members">مساحة الأعضاء</a></li>
        <li><a href="${base}/level-test">اختبار المستوى</a></li>
        <li><a href="${base}/courses">الدروس المجانية</a></li>
        <li><a href="${base}/exams">الامتحانات</a></li>
      </ul>
    `,
  };
}

export async function sendMemberWelcomeEmail(
  input: WelcomeMailInput,
): Promise<{ sent: boolean; error?: string }> {
  const base = getSiteUrl();
  const loginUrl = `${base}/members/login`;
  const steps = nextStepsBlock(base);
  const subject = "قصبة إنجليش — تم قبولك في المجتمع | Kasbah English — You’re accepted";

  const text = [
    `مرحبًا ${input.name},`,
    "",
    "تم قبول طلبك في قصبة إنجليش.",
    "يمكنك الآن الدخول إلى مساحة الأعضاء:",
    loginUrl,
    "",
    `البريد: ${input.to}`,
    `كلمة المرور المؤقتة: ${input.tempPassword}`,
    "",
    "غيّر كلمة المرور من «نسيت كلمة المرور» بعد أول دخول إن احتجت.",
    "",
    steps.text,
    "",
    "—",
    "",
    `Hello ${input.name},`,
    "",
    "Your Kasbah English application was accepted.",
    "Sign in here:",
    loginUrl,
    "",
    `Email: ${input.to}`,
    `Temporary password: ${input.tempPassword}`,
    "",
    "Kasbah English / قصبة إنجليش",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a2433;max-width:560px">
      <h2 style="margin:0 0 12px">قصبة إنجليش</h2>
      <p>مرحبًا <strong>${escapeHtml(input.name)}</strong>،</p>
      <p>تم قبول طلبك. يمكنك الدخول إلى مساحة الأعضاء من هنا:</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <p><strong>البريد:</strong> ${escapeHtml(input.to)}<br/>
      <strong>كلمة المرور المؤقتة:</strong> <code style="background:#e7eef6;padding:4px 8px;border-radius:4px">${escapeHtml(input.tempPassword)}</code></p>
      ${steps.html}
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p>Hello <strong>${escapeHtml(input.name)}</strong>,</p>
      <p>Your application was accepted. Sign in at the link above with your temporary password.</p>
      <p style="color:#5a6b7d;font-size:14px">Kasbah English / قصبة إنجليش</p>
    </div>
  `;

  return sendMail({ to: input.to, subject, text, html });
}

export async function sendExistingMemberAcceptedEmail(
  input: ExistingMemberMailInput,
): Promise<{ sent: boolean; error?: string }> {
  const base = getSiteUrl();
  const loginUrl = `${base}/members/login`;
  const steps = nextStepsBlock(base);
  const subject = "قصبة إنجليش — تم تفعيل طلبك | Kasbah English — Application activated";

  const text = [
    `مرحبًا ${input.name},`,
    "",
    "تم قبول طلبك. حسابك موجود مسبقًا — سجّل الدخول بنفس بياناتك:",
    loginUrl,
    "",
    "إذا نسيت كلمة المرور، استخدم رابط نسيت كلمة المرور في صفحة الدخول.",
    "",
    steps.text,
    "",
    "Kasbah English / قصبة إنجليش",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a2433;max-width:560px">
      <h2 style="margin:0 0 12px">قصبة إنجليش</h2>
      <p>مرحبًا <strong>${escapeHtml(input.name)}</strong>،</p>
      <p>تم قبول طلبك. حسابك موجود مسبقًا — سجّل الدخول من هنا:</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <p>إذا نسيت كلمة المرور، استخدم «نسيت كلمة المرور» في صفحة الدخول.</p>
      ${steps.html}
      <p style="color:#5a6b7d;font-size:14px">Kasbah English / قصبة إنجليش</p>
    </div>
  `;

  return sendMail({ to: input.to, subject, text, html });
}

export async function sendPasswordResetEmail(
  input: ResetMailInput,
): Promise<{ sent: boolean; error?: string }> {
  const subject = "قصبة إنجليش — إعادة تعيين كلمة المرور | Kasbah English — Reset password";

  const text = [
    `مرحبًا ${input.name},`,
    "",
    "طلبت إعادة تعيين كلمة المرور. افتح الرابط خلال ساعة:",
    input.resetUrl,
    "",
    "إذا لم تطلب هذا، تجاهل الرسالة.",
    "",
    "—",
    "",
    `Hello ${input.name},`,
    "",
    "You requested a password reset. Open this link within one hour:",
    input.resetUrl,
    "",
    "If you did not request this, ignore the email.",
    "",
    "Kasbah English / قصبة إنجليش",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a2433;max-width:560px">
      <h2 style="margin:0 0 12px">قصبة إنجليش</h2>
      <p>مرحبًا <strong>${escapeHtml(input.name)}</strong>،</p>
      <p>لإعادة تعيين كلمة المرور، افتح الرابط خلال ساعة:</p>
      <p><a href="${escapeHtml(input.resetUrl)}">${escapeHtml(input.resetUrl)}</a></p>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p>Hello <strong>${escapeHtml(input.name)}</strong>,</p>
      <p>Open the link above within one hour to reset your password.</p>
      <p style="color:#5a6b7d;font-size:14px">Kasbah English / قصبة إنجليش</p>
    </div>
  `;

  return sendMail({ to: input.to, subject, text, html });
}
