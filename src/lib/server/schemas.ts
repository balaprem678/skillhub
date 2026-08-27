import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  fullName: string;
  phone: string;
  course: string;
  mode: string;
  status: "New" | "Contacted" | "Enrolled" | "Closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettings extends Document {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  senderEmail: string;
  adminEmails: string[];
  updatedAt: Date;
}

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Enrolled", "Closed"],
      default: "New",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const SettingsSchema = new Schema<ISettings>(
  {
    smtpHost: { type: String, default: "smtp.gmail.com" },
    smtpPort: { type: Number, default: 465 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },
    smtpSecure: { type: Boolean, default: true },
    senderEmail: { type: String, default: "" },
    adminEmails: { type: [String], default: ["skillhub.call@gmail.com"] },
  },
  { timestamps: true }
);

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
