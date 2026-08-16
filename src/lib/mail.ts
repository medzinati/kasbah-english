import nodemailer from "nodemailer";

type WelcomeMailInput = {
  to: string;
  name: string;
  tempPassword: string;
};

type ResetMailInput = {
  to: string;
  name: string;
  resetUrl: string;
};

function siteUrl() {
  return (process.env.NEXTAUTH_URL || "https://kasbahenglish.com").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

export async function sendMemberWelcomeEmail(
  input: WelcomeMailInput,
): Promise<{ sent: boolean; error?: string }> {
  const loginUrl = `${siteUrl()}/members/login`;
  const subject = "قصبة إنجليش — تم قبولك في المجتمع | Kasbah English — You’re accepted";

  const text = [
    `مرحبًا ${input.name},`,
    "",
    "تم قبول طلبك في قصبة إنجليش.",
    "يمكنك الآن الدخول إلى مساحة الأعضاء:",
    loginUrl,
    "",
    `كلمة المرور المؤقتة: ${input.tempPassword}`,
    "",
    "يمكنك تغيير كلمة المرور من رابط نسيت كلمة المرور بعد الدخول إن احتجت.",
    "",
    "—",
    "",
    `Hello ${input.name},`,
    "",
    "Your Kasbah English application was accepted.",
    "Sign in here:",
    loginUrl,
    "",
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
      <p><strong>كلمة المرور المؤقتة:</strong> <code style="background:#e7eef6;padding:4px 8px;border-radius:4px">${escapeHtml(input.tempPassword)}</code></p>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p>Hello <strong>${escapeHtml(input.name)}</strong>,</p>
      <p>Your application was accepted. Sign in at the link above.</p>
      <p><strong>Temporary password:</strong> <code style="background:#e7eef6;padding:4px 8px;border-radius:4px">${escapeHtml(input.tempPassword)}</code></p>
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
