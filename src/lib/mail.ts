import nodemailer from "nodemailer";

type WelcomeMailInput = {
  to: string;
  name: string;
  tempPassword: string;
};

function siteUrl() {
  return (process.env.NEXTAUTH_URL || "https://kasbahenglish.com").replace(/\/$/, "");
}

function buildWelcomeContent({ name, tempPassword }: Omit<WelcomeMailInput, "to">) {
  const loginUrl = `${siteUrl()}/members/login`;
  const subject = "قصبة إنجليش — تم قبولك في المجتمع | Kasbah English — You’re accepted";

  const text = [
    `مرحبًا ${name},`,
    "",
    "تم قبول طلبك في قصبة إنجليش.",
    "يمكنك الآن الدخول إلى مساحة الأعضاء:",
    loginUrl,
    "",
    `البريد الإلكتروني: (نفس عنوانك)`,
    `كلمة المرور المؤقتة: ${tempPassword}`,
    "",
    "ننصحك بتغيير كلمة المرور بعد أول دخول إن أمكن لاحقًا.",
    "",
    "—",
    "",
    `Hello ${name},`,
    "",
    "Your Kasbah English application was accepted.",
    "Sign in here:",
    loginUrl,
    "",
    `Temporary password: ${tempPassword}`,
    "",
    "Welcome to the community.",
    "Kasbah English / قصبة إنجليش",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#12101a;max-width:560px">
      <h2 style="margin:0 0 12px">قصبة إنجليش</h2>
      <p>مرحبًا <strong>${escapeHtml(name)}</strong>،</p>
      <p>تم قبول طلبك. يمكنك الدخول إلى مساحة الأعضاء من هنا:</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <p><strong>كلمة المرور المؤقتة:</strong> <code style="background:#f3f1ec;padding:4px 8px;border-radius:4px">${escapeHtml(tempPassword)}</code></p>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p>Your application was accepted. Sign in at the link above.</p>
      <p><strong>Temporary password:</strong> <code style="background:#f3f1ec;padding:4px 8px;border-radius:4px">${escapeHtml(tempPassword)}</code></p>
      <p style="color:#5c5668;font-size:14px">Kasbah English / قصبة إنجليش</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendMemberWelcomeEmail(
  input: WelcomeMailInput,
): Promise<{ sent: boolean; error?: string }> {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.CONTACT_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return {
      sent: false,
      error: "Email not configured (set GMAIL_APP_PASSWORD or SMTP_PASS).",
    };
  }

  const { subject, text, html } = buildWelcomeContent(input);

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
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    console.error("Welcome email error", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Failed to send email.",
    };
  }
}
