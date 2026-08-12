import Link from "next/link";
import { ClipboardList, MessageSquare } from "lucide-react";
import AdminResourceCreator from "@/components/AdminResourceCreator";
import AdminResourceManager from "@/components/AdminResourceManager";
import AdminUserCreator from "@/components/AdminUserCreator";
import { listUsers } from "@/lib/auth";
import { listResources } from "@/lib/resources";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PortalAdminPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const users = isAdmin ? await listUsers() : [];
  const resources = isAdmin ? await listResources() : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-red">
            Admin Console
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">队内后台</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-rm-gray">
            队员可查看报名记录和留言；管理员可以创建账号、维护资料和删除数据。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/portal/admin/recruit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rm-red/40 bg-rm-red/10 px-4 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15"
          >
            <ClipboardList className="h-4 w-4" />
            报名记录
          </Link>
          <Link
            href="/portal/admin/wall"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rm-blue/40 bg-rm-blue/10 px-4 text-sm font-bold text-rm-blue transition-colors hover:bg-rm-blue/15"
          >
            <MessageSquare className="h-4 w-4" />
            留言管理
          </Link>
        </div>
      </div>

      {isAdmin ? (
        <>
          <AdminUserCreator initialUsers={users} />
          <AdminResourceCreator />
          <AdminResourceManager initialResources={resources} />
        </>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-12 text-center">
          <h3 className="text-xl font-black text-white">当前为队员权限</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-rm-gray">
            你可以查看报名记录和留言内容。账号创建、资料维护和删除操作仅管理员可用。
          </p>
        </div>
      )}
    </div>
  );
}
