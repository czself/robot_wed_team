import RecruitAdmin from "@/components/RecruitAdmin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "报名管理 · YZ Control",
};

export default function RecruitAdminPage() {
  return (
    <div className="min-h-screen bg-[#070707] pt-24 pb-16">
      <RecruitAdmin />
    </div>
  );
}
