import nodemailer from "nodemailer";
import { connectToDatabase } from "./db";
import { Settings, ISettings } from "./schemas";

export async function getOrCreateSettings(): Promise<ISettings> {
  await connectToDatabase();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      smtpHost: "smtp.gmail.com",
      smtpPort: 465,
      smtpUser: "",
      smtpPass: "",
      smtpSecure: true,
      senderEmail: "skillhub.call@gmail.com",
      adminEmails: ["skillhub.call@gmail.com"],
    });
  }
  return settings;
}

export async function sendEnquiryNotificationEmail(data: {
  fullName: string;
  phone: string;
  course: string;
  mode: string;
  createdAt?: Date;
}) {
  try {
    const settings = await getOrCreateSettings();

    if (!settings.smtpUser || !settings.smtpPass) {
      console.log("SMTP Credentials not configured in Settings. Skipping email notification.");
      return { success: false, reason: "SMTP not configured" };
    }

    const recipientList = (settings.adminEmails && settings.adminEmails.length > 0)
      ? settings.adminEmails
      : [settings.smtpUser];

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost || "smtp.gmail.com",
      port: settings.smtpPort || 465,
      secure: settings.smtpSecure ?? true,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    const dateStr = (data.createdAt || new Date()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Admission Enquiry</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .badge { display: inline-block; background: #f59e0b; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; uppercase; text-transform: uppercase; margin-bottom: 10px; }
        .content { padding: 28px 24px; }
        .detail-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .row { display: flex; border-bottom: 1px solid #e2e8f0; padding: 10px 0; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #64748b; width: 140px; shrink: 0; }
        .value { font-weight: 600; color: #0f172a; flex: 1; }
        .value a { color: #0d9488; text-decoration: none; }
        .btn { display: block; width: 100%; text-align: center; background: #0d9488; color: #ffffff; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; box-sizing: border-box; margin-top: 24px; }
        .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="badge">🎯 New Lead Received</span>
          <h1>SkillHub Admission Enquiry</h1>
          <p>A new student callback request has been submitted</p>
        </div>
        <div class="content">
          <div class="detail-card">
            <div class="row">
              <div class="label">Student Name:</div>
              <div class="value">${data.fullName}</div>
            </div>
            <div class="row">
              <div class="label">Mobile Number:</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            <div class="row">
              <div class="label">Course Interested:</div>
              <div class="value">${data.course}</div>
            </div>
            <div class="row">
              <div class="label">Preferred Mode:</div>
              <div class="value">${data.mode}</div>
            </div>
            <div class="row">
              <div class="label">Received On:</div>
              <div class="value">${dateStr}</div>
            </div>
          </div>
          <a href="https://bharathiskillhub.com/admin/enquiries" class="btn">View in Admin Panel &rarr;</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SkillHub Career Courses &bull; Ambattur, Chennai
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"${settings.senderEmail || "SkillHub Admissions"}" <${settings.smtpUser}>`,
      to: recipientList.join(", "),
      subject: `🎯 New Enquiry: ${data.fullName} - ${data.course}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admission enquiry email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send admission enquiry email:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendTestEmail(testRecipient?: string) {
  const settings = await getOrCreateSettings();
  if (!settings.smtpUser || !settings.smtpPass) {
    throw new Error("SMTP User and App Password must be configured first.");
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost || "smtp.gmail.com",
    port: settings.smtpPort || 465,
    secure: settings.smtpSecure ?? true,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });

  const targets = testRecipient
    ? [testRecipient]
    : (settings.adminEmails && settings.adminEmails.length > 0 ? settings.adminEmails : [settings.smtpUser]);

  const info = await transporter.sendMail({
    from: `"${settings.senderEmail || "SkillHub Admin"}" <${settings.smtpUser}>`,
    to: targets.join(", "),
    subject: "✅ SkillHub Google SMTP Test Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0d9488;">Google SMTP Connection Successful!</h2>
        <p>Your Google SMTP configuration and email settings in SkillHub Admin Panel are working properly.</p>
        <p><strong>Configured Admin Recipient Emails:</strong> ${targets.join(", ")}</p>
        <p style="color: #64748b; font-size: 12px;">Sent at ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  return { success: true, messageId: info.messageId, recipient: targets.join(", ") };
}
