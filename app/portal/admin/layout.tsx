import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/session";

export default async function PortalAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return children;
}
