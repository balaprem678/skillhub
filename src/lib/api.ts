import { createServerFn } from "@tanstack/react-start";

export const submitEnquiryFn = createServerFn({ method: "POST" })
  .validator((data: { fullName: string; phone: string; course: string; mode: string }) => data)
  .handler(async ({ data }) => {
    const { submitEnquiryServer } = await import("./backend/actions.server");
    return submitEnquiryServer(data);
  });

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { adminLoginServer } = await import("./backend/actions.server");
    return adminLoginServer(data);
  });

export const getAdminSessionFn = createServerFn({ method: "GET" })
  .validator((token?: string) => token)
  .handler(async ({ data: token }) => {
    const { getAdminSessionServer } = await import("./backend/actions.server");
    return getAdminSessionServer(token);
  });

export const getEnquiriesFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; search?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const { getEnquiriesServer } = await import("./backend/actions.server");
    return getEnquiriesServer(data);
  });

export const updateEnquiryStatusFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string; status: "New" | "Contacted" | "Enrolled" | "Closed"; notes?: string }) => data)
  .handler(async ({ data }) => {
    const { updateEnquiryStatusServer } = await import("./backend/actions.server");
    return updateEnquiryStatusServer(data);
  });

export const deleteEnquiryFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { deleteEnquiryServer } = await import("./backend/actions.server");
    return deleteEnquiryServer(data);
  });

export const getSettingsFn = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const { getSettingsServer } = await import("./backend/actions.server");
    return getSettingsServer(token);
  });

export const updateSettingsFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    smtpSecure: boolean;
    senderEmail: string;
    adminEmails: string[];
  }) => data)
  .handler(async ({ data }) => {
    const { updateSettingsServer } = await import("./backend/actions.server");
    return updateSettingsServer(data);
  });

export const sendTestEmailActionFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; testRecipient?: string }) => data)
  .handler(async ({ data }) => {
    const { sendTestEmailActionServer } = await import("./backend/actions.server");
    return sendTestEmailActionServer(data);
  });

export const updateAdminPasswordFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; currentPass: string; newPass: string }) => data)
  .handler(async ({ data }) => {
    const { updateAdminPasswordServer } = await import("./backend/actions.server");
    return updateAdminPasswordServer(data);
  });
