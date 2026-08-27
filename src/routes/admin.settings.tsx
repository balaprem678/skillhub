import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  KeyRound,
  Send,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import {
  getSettingsFn,
  updateSettingsFn,
  sendTestEmailActionFn,
  updateAdminPasswordFn,
} from "@/lib/server/api";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Settings State
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [senderEmail, setSenderEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState<string[]>(["skillhub.call@gmail.com"]);
  const [newEmailInput, setNewEmailInput] = useState("");

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // UI Alerts
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testEmailMessage, setTestEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testRecipient, setTestRecipient] = useState("");
  const [showPass, setShowPass] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const res = await getSettingsFn({ data: token });
      if (res.settings) {
        setSmtpHost(res.settings.smtpHost || "smtp.gmail.com");
        setSmtpPort(res.settings.smtpPort || 465);
        setSmtpUser(res.settings.smtpUser || "");
        setSmtpPass(res.settings.smtpPass || "");
        setSmtpSecure(res.settings.smtpSecure ?? true);
        setSenderEmail(res.settings.senderEmail || res.settings.smtpUser || "skillhub.call@gmail.com");
        setAdminEmails(res.settings.adminEmails || ["skillhub.call@gmail.com"]);
        if (res.settings.adminEmails?.[0]) {
          setTestRecipient(res.settings.adminEmails[0]);
        }
      }
    } catch (err: any) {
      setSettingsMessage({ type: "error", text: err.message || "Failed to load settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const res = await updateSettingsFn({
        data: {
          token,
          smtpHost,
          smtpPort: Number(smtpPort),
          smtpUser,
          smtpPass,
          smtpSecure,
          senderEmail: senderEmail || smtpUser,
          adminEmails,
        },
      });
      setSettingsMessage({ type: "success", text: res.message || "SMTP and Email settings saved successfully!" });
    } catch (err: any) {
      setSettingsMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddAdminEmail = () => {
    const trimmed = newEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSettingsMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (adminEmails.includes(trimmed)) {
      setSettingsMessage({ type: "error", text: "Email is already added to recipients." });
      return;
    }
    setAdminEmails([...adminEmails, trimmed]);
    setNewEmailInput("");
    setSettingsMessage(null);
  };

  const handleRemoveAdminEmail = (emailToRemove: string) => {
    if (adminEmails.length <= 1) {
      setSettingsMessage({ type: "error", text: "At least one admin email recipient is required." });
      return;
    }
    setAdminEmails(adminEmails.filter((e) => e !== emailToRemove));
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    setTestEmailMessage(null);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const target = testRecipient.trim() || adminEmails[0] || smtpUser;
      const res = await sendTestEmailActionFn({ data: { token, testRecipient: target } });
      setTestEmailMessage({ type: "success", text: res.message });
    } catch (err: any) {
      setTestEmailMessage({ type: "error", text: err.message || "Failed to send test email. Check your SMTP user & App Password." });
    } finally {
      setSendingTest(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPass.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const res = await updateAdminPasswordFn({
        data: {
          token,
          currentPass,
          newPass,
        },
      });
      setPasswordMessage({ type: "success", text: res.message });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* HEADER */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          System & Email Settings
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Configure Google SMTP credentials, multiple recipient admin emails, and update account password.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading settings configuration...</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT 2 COLUMNS: SMTP & RECIPIENTS */}
          <div className="lg:col-span-2 space-y-8">
            {/* GOOGLE SMTP CONFIGURATION CARD */}
            <form onSubmit={handleSaveSettings} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/10 text-teal-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-white">Google SMTP Configuration</h2>
                    <p className="text-xs text-slate-400">Google Mail server credentials for sending instant lead notifications</p>
                  </div>
                </div>
                <span className="rounded-full bg-teal-500/10 border border-teal-500/30 px-3 py-1 text-[11px] font-bold text-teal-400">
                  Gmail Ready
                </span>
              </div>

              {settingsMessage && (
                <div
                  className={`flex items-start gap-3 rounded-xl p-4 text-xs font-medium ${
                    settingsMessage.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {settingsMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  )}
                  <span>{settingsMessage.text}</span>
                </div>
              )}

              {/* GMAIL APP PASSWORD GUIDE BANNER */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                  <HelpCircle className="h-4 w-4" />
                  <span>How to get Google App Password for Gmail:</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-1">
                  <td>Go to Google Account Security (`myaccount.google.com/security`).</td>
                  <td>Ensure <strong>2-Step Verification</strong> is enabled.</td>
                  <td>Search for <strong>App passwords</strong> and create a password named "SkillHub Admin".</td>
                  <td>Paste the generated 16-letter App Password into the field below.</td>
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* SMTP HOST */}
                <div>
                  <label className="block text-xs font-bold text-slate-300">SMTP Host Server</label>
                  <div className="relative mt-1.5">
                    <Server className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SMTP PORT */}
                <div>
                  <label className="block text-xs font-bold text-slate-300">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    placeholder="465"
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="mt-1 block text-[10px] text-slate-500">465 (SSL) or 587 (TLS)</span>
                </div>

                {/* GMAIL USERNAME */}
                <div>
                  <label className="block text-xs font-bold text-slate-300">Google Email ID (Sender User)</label>
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* GMAIL APP PASSWORD */}
                <div>
                  <label className="block text-xs font-bold text-slate-300">Google App Password</label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPass ? "text" : "password"}
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="abcd efgh ijkl mnop"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-4 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* SENDER EMAIL NAME / HEADER */}
                <div>
                  <label className="block text-xs font-bold text-slate-300">Sender Display Email</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="skillhub.call@gmail.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* SSL CHECKBOX */}
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="smtpSecure"
                    checked={smtpSecure}
                    onChange={(e) => setSmtpSecure(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-teal-500"
                  />
                  <label htmlFor="smtpSecure" className="text-xs font-bold text-slate-300 cursor-pointer">
                    Enable SSL Security (Checked for Port 465)
                  </label>
                </div>
              </div>

              {/* RECIPIENT ADMIN EMAILS SECTION */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div>
                  <h3 className="font-display text-sm font-bold text-white">Admin Email Recipients</h3>
                  <p className="text-xs text-slate-400">
                    When a student submits an admission enquiry, instant notifications are emailed to ALL the addresses listed below.
                  </p>
                </div>

                {/* ADD NEW EMAIL */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAdminEmail();
                      }
                    }}
                    placeholder="add.another.admin@gmail.com"
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAdminEmail}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Email
                  </button>
                </div>

                {/* EMAIL TAGS LIST */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {adminEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300"
                    >
                      <Mail className="h-3.5 w-3.5 text-teal-400" />
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdminEmail(email)}
                        className="text-teal-400/60 hover:text-rose-400 transition-colors"
                        title="Remove Email"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="border-t border-slate-800 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingSettings ? "Saving Settings..." : "Save SMTP & Recipient Settings"}
                </button>
              </div>
            </form>

            {/* SEND TEST EMAIL CARD */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">Test Google SMTP Delivery</h2>
                  <p className="text-xs text-slate-400">Send an immediate test email to verify your Google credentials</p>
                </div>
              </div>

              {testEmailMessage && (
                <div
                  className={`flex items-start gap-3 rounded-xl p-4 text-xs font-medium ${
                    testEmailMessage.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {testEmailMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  )}
                  <span>{testEmailMessage.text}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition-all disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${sendingTest ? "animate-pulse" : ""}`} />
                  {sendingTest ? "Sending Test..." : "Send Test Email"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SECURITY / CHANGE ADMIN PASSWORD */}
          <div className="space-y-8">
            <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">Change Admin Password</h2>
                  <p className="text-xs text-slate-400">Update login credentials for your admin account</p>
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`flex items-start gap-3 rounded-xl p-4 text-xs font-medium ${
                    passwordMessage.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-slate-300">Current Password</label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-slate-300">New Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div>
                <label className="block text-xs font-bold text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all disabled:opacity-50"
              >
                {updatingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
