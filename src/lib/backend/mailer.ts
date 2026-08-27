import nodemailer from "nodemailer";
import { connectToDatabase } from "./db";
import { Settings } from "./schemas";

export async function getOrCreateSettings() {
  await connectToDatabase();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: Number(process.env.SMTP_PORT) || 465,
      smtpUser: process.env.SMTP_USER || "",
      smtpPass: process.env.SMTP_PASS || "",
      smtpSecure: process.env.SMTP_SECURE !== "false",
      senderEmail: process.env.SENDER_EMAIL || process.env.SMTP_USER || "skillhub.call@gmail.com",
      adminEmails: (process.env.ADMIN_RECIPIENT_EMAILS || "skillhub.call@gmail.com")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
    });
  }
  return settings;
}

export async function createSmtpTransporter() {
  const settings = await getOrCreateSettings();

  const host = settings.smtpHost || "smtp.gmail.com";
  const port = settings.smtpPort || 465;
  const user = settings.smtpUser || process.env.SMTP_USER || "";
  const pass = settings.smtpPass || process.env.SMTP_PASS || "";
  const secure = settings.smtpSecure ?? true;

  if (!user || !pass) {
    console.warn("SMTP credentials not fully configured. Email notifications skipped.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return { transporter, settings };
}

export async function sendEnquiryNotificationEmail(enquiryData: {
  fullName: string;
  phone: string;
  course: string;
  mode: string;
  createdAt: Date;
}) {
  try {
    const { transporter, settings } = await createSmtpTransporter();
    
    if (!settings.smtpUser || !settings.smtpPass) {
      console.warn("Cannot send enquiry email: SMTP User / App Password not saved in Settings.");
      return;
    }

    const recipients = settings.adminEmails.length > 0
      ? settings.adminEmails
      : [settings.senderEmail];

    const formattedDate = new Date(enquiryData.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 30px 24px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; }
          .header p { margin: 6px 0 0 0; color: #ccfbf1; font-size: 14px; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; background: #0f766e; color: #ffffff; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 20px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .info-table td { padding: 12px 14px; border-bottom: 1px solid #334155; font-size: 14px; }
          .info-table td.label { font-weight: 600; color: #94a3b8; width: 35%; }
          .info-table td.value { font-weight: 700; color: #ffffff; }
          .phone-highlight { background: #0f766e; color: #ffffff; padding: 4px 10px; border-radius: 8px; text-decoration: none; display: inline-block; }
          .footer { background: #0f172a; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Skill Hub Ambattur</h1>
            <p>New Admission Enquiry Received!</p>
          </div>
          <div class="content">
            <span class="badge">🎯 New Lead Received</span>
            <table class="info-table">
              <tr>
                <td class="label">Student Name</td>
                <td class="value">${enquiryData.fullName}</td>
              </tr>
              <tr>
                <td class="label">Mobile Number</td>
                <td class="value">
                  <a href="tel:${enquiryData.phone}" class="phone-highlight">📞 ${enquiryData.phone}</a>
                </td>
              </tr>
              <tr>
                <td class="label">Course Interested</td>
                <td class="value" style="color: #2dd4bf;">${enquiryData.course}</td>
              </tr>
              <tr>
                <td class="label">Preferred Mode</td>
                <td class="value">${enquiryData.mode}</td>
              </tr>
              <tr>
                <td class="label">Submitted Time</td>
                <td class="value">${formattedDate}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
              Please log in to your SkillHub Admin Panel to update the enquiry status and add follow-up notes.
            </p>
          </div>
          <div class="footer">
            Skill Hub Institute — Ambattur, Chennai | Automated Notification Engine
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"SkillHub Leads" <${settings.senderEmail || settings.smtpUser}>`,
      to: recipients.join(", "),
      subject: `🎯 New Enquiry: ${enquiryData.fullName} (${enquiryData.course})`,
      html: htmlContent,
    });

    console.log(`Enquiry notification email sent to ${recipients.join(", ")}`);
  } catch (err) {
    console.error("Failed to send email notification:", err);
  }
}

export async function sendTestEmail(targetRecipient?: string) {
  const { transporter, settings } = await createSmtpTransporter();

  if (!settings.smtpUser || !settings.smtpPass) {
    throw new Error("Google SMTP Username or App Password is not saved in Settings.");
  }

  const recipient = targetRecipient || settings.adminEmails[0] || settings.senderEmail;

  await transporter.sendMail({
    from: `"SkillHub Admin" <${settings.senderEmail || settings.smtpUser}>`,
    to: recipient,
    subject: "✅ SkillHub Google SMTP Connection Test",
    html: `
      <div style="font-family: sans-serif; background: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #2dd4bf;">SkillHub SMTP Connection Successful!</h2>
        <p>Your Google App Password and Nodemailer configuration are working correctly.</p>
        <p><strong>Configured Recipient Emails:</strong> ${settings.adminEmails.join(", ")}</p>
        <hr style="border-color: #334155;" />
        <p style="font-size: 12px; color: #94a3b8;">Skill Hub Admin System</p>
      </div>
    `,
  });

  return { success: true, recipient };
}
