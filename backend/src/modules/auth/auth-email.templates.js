const PRODUCT_NAME = "JWSocial";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailShell({ title, eyebrow, intro, ctaLabel, ctaUrl, footerNote, bodyHtml = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#eef3f8;font-family:Arial,sans-serif;color:#213547;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #d7e3f0;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#f7fbff 0%,#e7f0fb 100%);border-bottom:1px solid #d7e3f0;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#5f7d9b;font-weight:700;">${eyebrow}</div>
              <div style="margin-top:8px;font-size:30px;line-height:1.15;font-weight:800;color:#17324d;">${PRODUCT_NAME}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#17324d;">${title}</h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#48627d;">${intro}</p>
              ${bodyHtml}
              ${
                ctaUrl
                  ? `<div style="margin-top:28px;"><a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#5f7d9b;color:#ffffff;text-decoration:none;font-weight:700;">${ctaLabel}</a></div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 32px;color:#6f859b;font-size:13px;line-height:1.6;border-top:1px solid #e4edf6;">
              ${footerNote}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomeEmail({ userName, dashboardUrl, supportEmail }) {
  const safeName = escapeHtml(userName);
  const safeUrl = escapeHtml(dashboardUrl);
  const safeSupportEmail = escapeHtml(supportEmail);

  return {
    subject: `Welcome to ${PRODUCT_NAME}`,
    text: `Welcome to ${PRODUCT_NAME}, ${userName}. Visit your home page: ${dashboardUrl}`,
    html: buildEmailShell({
      title: `Welcome, ${safeName}`,
      eyebrow: "Faith-Centered Community",
      intro:
        "Your account is ready. JWSocial is designed for respectful discussion, daily spiritual encouragement, and calm fellowship among brothers and sisters.",
      ctaLabel: "Open JWSocial",
      ctaUrl: safeUrl,
      footerNote: `If you need help, reply to this email or contact ${safeSupportEmail}.`,
      bodyHtml:
        '<div style="padding:18px 20px;border-radius:18px;background:#f6faff;border:1px solid #dce7f3;color:#35516e;font-size:15px;line-height:1.7;">Start by reading the daily discussion, joining a topic, or sharing an encouraging thought with the congregation-minded community.</div>'
    })
  };
}

function buildVerifyEmail({ userName, verifyCode, otpCode, verifyUrl, supportEmail }) {
  const safeName = escapeHtml(userName);
  const resolvedCode = verifyCode || otpCode || "";
  const safeCode = escapeHtml(resolvedCode);
  const safeUrl = escapeHtml(verifyUrl);
  const safeSupportEmail = escapeHtml(supportEmail);

  return {
    subject: `Verify your ${PRODUCT_NAME} email`,
    text: `Hello ${userName}, your verification code is ${resolvedCode}. Verify here: ${verifyUrl}`,
    html: buildEmailShell({
      title: "Confirm your email address",
      eyebrow: "Account Verification",
      intro: `Hello ${safeName}, use the code below to verify your ${PRODUCT_NAME} account.`,
      ctaLabel: "Verify Email",
      ctaUrl: safeUrl,
      footerNote: `If you did not request this account, you can ignore this email. Support: ${safeSupportEmail}.`,
      bodyHtml: `
        <div style="margin:0 0 18px 0;color:#17324d;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;">
          Your verification code
        </div>
        <div style="display:inline-block;padding:18px 22px;border-radius:18px;border:2px solid #a9bfd4;background:#f7fbff;font-size:32px;letter-spacing:0.24em;font-weight:800;color:#17324d;font-family:Arial,Helvetica,sans-serif;">
          ${safeCode}
        </div>
        <div style="margin-top:18px;font-size:15px;line-height:1.7;color:#48627d;">
          If the button does not open, enter this code manually in the app: <strong style="color:#17324d;">${safeCode}</strong>
        </div>
      `
    })
  };
}

function buildResetPasswordEmail({ userName, resetUrl, supportEmail }) {
  const safeName = escapeHtml(userName);
  const safeUrl = escapeHtml(resetUrl);
  const safeSupportEmail = escapeHtml(supportEmail);

  return {
    subject: `Reset your ${PRODUCT_NAME} password`,
    text: `Hello ${userName}, reset your password here: ${resetUrl}`,
    html: buildEmailShell({
      title: "Password reset requested",
      eyebrow: "Account Security",
      intro: `Hello ${safeName}, we received a request to reset your password.`,
      ctaLabel: "Reset Password",
      ctaUrl: safeUrl,
      footerNote: `If you did not request this, no changes were made. Support: ${safeSupportEmail}.`,
      bodyHtml:
        '<div style="padding:18px 20px;border-radius:18px;background:#fffaf2;border:1px solid #ecd7ac;color:#6b5330;font-size:15px;line-height:1.7;">For your security, this link should be used soon and only by you.</div>'
    })
  };
}

function buildPasswordChangedEmail({ userName, changedAt, securityUrl, supportEmail }) {
  const safeName = escapeHtml(userName);
  const safeChangedAt = escapeHtml(changedAt);
  const safeUrl = escapeHtml(securityUrl);
  const safeSupportEmail = escapeHtml(supportEmail);

  return {
    subject: `${PRODUCT_NAME} password changed`,
    text: `Hello ${userName}, your password was changed at ${changedAt}. Review account security: ${securityUrl}`,
    html: buildEmailShell({
      title: "Your password was updated",
      eyebrow: "Security Notice",
      intro: `Hello ${safeName}, this is a confirmation that your password was changed.`,
      ctaLabel: "Review Security",
      ctaUrl: safeUrl,
      footerNote: `If this was not you, contact support immediately at ${safeSupportEmail}.`,
      bodyHtml: `<div style="padding:18px 20px;border-radius:18px;background:#f6faff;border:1px solid #dce7f3;color:#35516e;font-size:15px;line-height:1.7;"><strong>Changed at:</strong> ${safeChangedAt}</div>`
    })
  };
}

module.exports = {
  PRODUCT_NAME,
  buildWelcomeEmail,
  buildVerifyEmail,
  buildResetPasswordEmail,
  buildPasswordChangedEmail
};
