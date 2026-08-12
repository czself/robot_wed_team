import RecruitAdmin from "@/components/RecruitAdmin";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "报名管理 · YZ Control",
};

export default async function PortalRecruitAdminPage() {
  await requireUser();

  return <RecruitAdmin canDelete />;
}
