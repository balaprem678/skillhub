import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { Enquiry, Settings, Admin } from "./schemas";
import { ensureInitialAdmin, createSessionToken, verifySessionToken } from "./auth";
import { sendEnquiryNotificationEmail, sendTestEmail, getOrCreateSettings } from "./mailer";

export async function submitEnquiryServer(data: { fullName: string; phone: string; course: string; mode: string }) {
  await connectToDatabase();
  
  if (!data.fullName || !data.phone || !data.course) {
    throw new Error("Full name, phone number, and course are required.");
  }

  const newEnquiry = await Enquiry.create({
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    course: data.course.trim(),
    mode: data.mode || "Offline — Ambattur centre",
    status: "New",
  });

  sendEnquiryNotificationEmail({
    fullName: newEnquiry.fullName,
    phone: newEnquiry.phone,
    course: newEnquiry.course,
    mode: newEnquiry.mode,
    createdAt: newEnquiry.createdAt,
  }).catch((err) => console.error("Error sending email notification:", err));

  return {
    success: true,
    id: newEnquiry._id.toString(),
    message: "Enquiry submitted successfully! We will call you back within 24 hours.",
  };
}

export async function adminLoginServer(data: { username: string; password: string }) {
  await ensureInitialAdmin();
  await connectToDatabase();

  const admin = await Admin.findOne({ username: data.username.trim() });
  if (!admin) {
    throw new Error("Invalid username or password.");
  }

  const isValid = await bcrypt.compare(data.password, admin.passwordHash);
  if (!isValid) {
    throw new Error("Invalid username or password.");
  }

  const token = await createSessionToken(admin.username);
  return { success: true, token, username: admin.username };
}

export async function getAdminSessionServer(token?: string) {
  if (!token) return { authenticated: false };
  const username = await verifySessionToken(token);
  if (!username) return { authenticated: false };
  return { authenticated: true, username };
}

export async function getEnquiriesServer(data: { token: string; search?: string; status?: string }) {
  const adminUser = await verifySessionToken(data.token);
  if (!adminUser) throw new Error("Unauthorized access.");

  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (data.status && data.status !== "All") {
    query.status = data.status;
  }

  if (data.search && data.search.trim() !== "") {
    const searchRegex = new RegExp(data.search.trim(), "i");
    query.$or = [
      { fullName: searchRegex },
      { phone: searchRegex },
      { course: searchRegex },
      { mode: searchRegex },
    ];
  }

  const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).lean();
  
  const totalCount = await Enquiry.countDocuments();
  const newCount = await Enquiry.countDocuments({ status: "New" });
  const contactedCount = await Enquiry.countDocuments({ status: "Contacted" });
  const enrolledCount = await Enquiry.countDocuments({ status: "Enrolled" });

  return {
    success: true,
    enquiries: enquiries.map((e) => ({
      id: e._id.toString(),
      fullName: e.fullName,
      phone: e.phone,
      course: e.course,
      mode: e.mode,
      status: e.status,
      notes: e.notes || "",
      createdAt: e.createdAt,
    })),
    stats: {
      total: totalCount,
      new: newCount,
      contacted: contactedCount,
      enrolled: enrolledCount,
    },
  };
}

export async function updateEnquiryStatusServer(data: { token: string; id: string; status: "New" | "Contacted" | "Enrolled" | "Closed"; notes?: string }) {
  const adminUser = await verifySessionToken(data.token);
  if (!adminUser) throw new Error("Unauthorized access.");

  await connectToDatabase();
  const updated = await Enquiry.findByIdAndUpdate(
    data.id,
    { status: data.status, notes: data.notes || "" },
    { new: true }
  );

  if (!updated) throw new Error("Enquiry not found.");
  return { success: true, id: updated._id.toString(), status: updated.status, notes: updated.notes };
}

export async function deleteEnquiryServer(data: { token: string; id: string }) {
  const adminUser = await verifySessionToken(data.token);
  if (!adminUser) throw new Error("Unauthorized access.");

  await connectToDatabase();
  await Enquiry.findByIdAndDelete(data.id);
  return { success: true, id: data.id };
}

export async function getSettingsServer(token: string) {
  const adminUser = await verifySessionToken(token);
  if (!adminUser) throw new Error("Unauthorized access.");

  const settings = await getOrCreateSettings();
  return {
    success: true,
    settings: {
      smtpHost: settings.smtpHost || "smtp.gmail.com",
      smtpPort: settings.smtpPort || 465,
      smtpUser: settings.smtpUser || "",
      smtpPass: settings.smtpPass || "",
      smtpSecure: settings.smtpSecure ?? true,
      senderEmail: settings.senderEmail || "skillhub.call@gmail.com",
      adminEmails: settings.adminEmails || ["skillhub.call@gmail.com"],
    },
  };
}

export async function updateSettingsServer(data: {
  token: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  senderEmail: string;
  adminEmails: string[];
}) {
  const adminUser = await verifySessionToken(data.token);
  if (!adminUser) throw new Error("Unauthorized access.");

  await connectToDatabase();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  settings.smtpHost = data.smtpHost.trim();
  settings.smtpPort = Number(data.smtpPort);
  settings.smtpUser = data.smtpUser.trim();
  settings.smtpPass = data.smtpPass.trim();
  settings.smtpSecure = Boolean(data.smtpSecure);
  settings.senderEmail = data.senderEmail.trim();
  settings.adminEmails = data.adminEmails.map((e) => e.trim()).filter(Boolean);

  await settings.save();
  return { success: true, message: "Settings updated successfully!" };
}

export async function sendTestEmailActionServer(data: { token: string; testRecipient?: string }) {
  const adminUser = await verifySessionToken(data.token);
  if (!adminUser) throw new Error("Unauthorized access.");

  const result = await sendTestEmail(data.testRecipient);
  return { success: true, message: `Test email sent to ${result.recipient}!` };
}

export async function updateAdminPasswordServer(data: { token: string; currentPass: string; newPass: string }) {
  const username = await verifySessionToken(data.token);
  if (!username) throw new Error("Unauthorized access.");

  await connectToDatabase();
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error("Admin not found.");

  const isValid = await bcrypt.compare(data.currentPass, admin.passwordHash);
  if (!isValid) throw new Error("Current password is incorrect.");

  admin.passwordHash = await bcrypt.hash(data.newPass, 10);
  await admin.save();

  return { success: true, message: "Admin password updated successfully!" };
}
