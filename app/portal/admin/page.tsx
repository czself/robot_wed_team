import Link from "next/link";
import { BookOpen, ClipboardList, MessageSquare, Users } from "lucide-react";
import AdminResourceCreator from "@/components/AdminResourceCreator";
import AdminResourceManager from "@/components/AdminResourceManager";
import AdminUserCreator from "@/components/AdminUserCreator";
import { listUsers } from "@/lib/auth";
import { listResources } from "@/lib/resources";
import { requireAdmin } from "@/lib/session";

export const metadata = {
  title: "队内后台",
};

export const dynamic = "force-dynamic";

export default async function PortalAdminPage() {
  const currentUser = await requireAdmin();
  const users = await listUsers();
  const resources = await listResources();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-red">
            Admin Console
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">队内后台</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-rm-gray">
            管理入口按用途拆开：账号、资料、报名、留言。先选要处理的事情，再进入对应区域。
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <a
          href="#accounts"
          className="rounded-lg border border-rm-blue/30 bg-rm-blue/10 p-4 text-rm-blue transition-colors hover:bg-rm-blue/15"
        >
          <Users className="mb-3 h-5 w-5" />
          <div className="font-black">账号管理</div>
          <div className="mt-1 text-xs text-rm-gray">创建、停用、重置密码</div>
        </a>
        <a
          href="#resources"
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-white transition-colors hover:border-rm-blue/30 hover:bg-rm-blue/10 hover:text-rm-blue"
        >
          <BookOpen className="mb-3 h-5 w-5" />
          <div className="font-black">资料维护</div>
          <div className="mt-1 text-xs text-rm-gray">训练、项目、规范链接</div>
        </a>
        <Link
          href="/portal/admin/recruit"
          className="rounded-lg border border-rm-red/30 bg-rm-red/10 p-4 text-rm-red transition-colors hover:bg-rm-red/15"
        >
          <ClipboardList className="mb-3 h-5 w-5" />
          <div className="font-black">报名记录</div>
          <div className="mt-1 text-xs text-rm-gray">查看和导出报名名单</div>
        </Link>
        <Link
          href="/portal/admin/wall"
          className="rounded-lg border border-rm-blue/30 bg-rm-blue/10 p-4 text-rm-blue transition-colors hover:bg-rm-blue/15"
        >
          <MessageSquare className="mb-3 h-5 w-5" />
          <div className="font-black">留言管理</div>
          <div className="mt-1 text-xs text-rm-gray">审核、删除留言内容</div>
        </Link>
      </div>

      <AdminUserCreator initialUsers={users} currentUserId={currentUser.id} />
      <section id="resources" className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-rm-red/30 bg-rm-red/10 text-rm-red">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">资料维护</h3>
            <p className="mt-1 text-sm text-rm-gray">
              维护队员资料库里的链接、分类和难度标签。
            </p>
          </div>
        </div>
        <AdminResourceCreator />
        <AdminResourceManager initialResources={resources} />
      </section>
    </div>
  );
}
