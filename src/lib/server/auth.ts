import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { Admin } from "./schemas";

const SECRET_SALT = process.env.ADMIN_SESSION_SECRET || "skillhub-admin-secret-key-2026";

export async function ensureInitialAdmin() {
  await connectToDatabase();
  const count = await Admin.countDocuments();
  if (count === 0) {
    const defaultPassword = "admin123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await Admin.create({
      username: "admin",
      passwordHash,
    });
    console.log("Initialized default admin account: username 'admin', password 'admin123'");
  }
}

export async function createSessionToken(username: string): Promise<string> {
  const timestamp = Date.now();
  const raw = `${username}:${timestamp}:${SECRET_SALT}`;
  const hash = await bcrypt.hash(raw, 5);
  // Base64 encode token payload
  const payload = JSON.stringify({ username, timestamp, hash });
  return Buffer.from(payload).toString("base64");
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    if (!token) return null;
    const jsonStr = Buffer.from(token, "base64").toString("utf-8");
    const { username, timestamp } = JSON.parse(jsonStr);
    
    // Check token age (valid for 7 days)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > SEVEN_DAYS_MS) {
      return null;
    }
    
    await connectToDatabase();
    const admin = await Admin.findOne({ username });
    if (!admin) return null;

    return username;
  } catch {
    return null;
  }
}
