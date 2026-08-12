import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "报名管理 · YZ Control",
};

export default function RecruitAdminPage() {
  redirect("/portal/admin/recruit");
}
