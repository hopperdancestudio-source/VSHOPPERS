import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const userEmail = reqHeaders.get("x-user-email") || "offline-mode@studio.com";

  return <AdminShell userEmail={userEmail}>{children}</AdminShell>;
}
