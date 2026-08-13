import RecruitAdmin from "@/components/RecruitAdmin";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "报名管理",
};

export default async function PortalRecruitAdminPage() {
  await requireAdmin();

  return <RecruitAdmin canDelete />;
}
