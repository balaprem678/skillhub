import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { Admin } from "./schemas";

const SECRET_KEY = process.env.JWT_SECRET || "skillhub_admin_secret_key_2026";

export async function ensureInitialAdmin() {
  await connectToDatabase();
  const count = await Admin.countDocuments();
  if (count === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await Admin.create({
      username: "admin",
      passwordHash,
    });
    console.log("Created initial default admin account: admin / admin123");
  }
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = {
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const str = JSON.stringify(payload);
  const encoded = Buffer.from(str).toString("base64");
  return `${encoded}.${Buffer.from(SECRET_KEY).toString("base64")}`;
}

export async function verifySessionToken(token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const str = Buffer.from(parts[0], "base64").toString("utf-8");
    const payload = JSON.parse(str);
    if (!payload.username || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload.username;
  } catch (err) {
    return null;
  }
}
