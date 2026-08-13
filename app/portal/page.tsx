import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  KeyRound,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import { requireUser } from "@/lib/session";
import { listResources } from "@/lib/resources";

export const dynamic = "force-dynamic";

const primaryModules = [
  {
    title: "资料库",
    desc: "训练路线、项目链接、规范和复盘资料统一从这里找。",
    href: "/portal/docs",
    icon: BookOpen,
  },
  {
    title: "报名记录",
    desc: "查看招新报名名单，按姓名、组别、电话快速搜索。",
    href: "/portal/admin/recruit",
    icon: ClipboardList,
  },
  {
    title: "留言管理",
    desc: "查看留言墙内容，处理待审核或不合适的留言。",
    href: "/portal/admin/wall",
    icon: MessageSquare,
  },
];

export default async function PortalPage() {
  const user = await requireUser();

  if (user.mustChangePassword) {
    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-rm-red/30 bg-rm-red/10 p-5 md:p-7">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-red">
            Security Required
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">
            请先设置你自己的密码
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-rm-gray">
            当前使用的是管理员分配的初始密码。修改完成后，所有旧会话都会失效，再重新登录即可进入资料库。
          </p>
        </section>
        <PasswordChangeForm />
      </div>
    );
  }

  const resources = await listResources();

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5 md:p-7">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-blue">
          Team Workspace
        </p>
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              队员工作台
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-rm-gray">
              这里放队员每天真正会用的入口：资料、报名记录、留言管理。账号和资料维护放在后台管理里，不再混在总览里。
            </p>
          </div>
          {user.role === "admin" && (
            <Link
              href="/portal/admin"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rm-red/40 bg-rm-red/10 px-5 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15"
            >
              <ShieldCheck className="h-4 w-4" />
              进入后台管理
            </Link>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="font-mono text-3xl font-black text-white">{resources.length}</div>
          <div className="mt-1 text-sm text-rm-gray">资料条目</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="font-mono text-3xl font-black text-rm-blue">6</div>
          <div className="mt-1 text-sm text-rm-gray">资料分类</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="font-mono text-3xl font-black text-rm-red">
            {user.username}
          </div>
          <div className="mt-1 text-sm text-rm-gray">当前账号</div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-white">常用入口</h3>
          <div className="text-xs text-rm-gray">按使用频率排序</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
        {primaryModules
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-rm-blue/40 hover:bg-rm-blue/[0.04]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-rm-gray">{item.desc}</p>
                <div className="mt-5 text-xs font-bold text-rm-blue transition-transform group-hover:translate-x-1">
                  打开 →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-rm-blue" />
          <h3 className="text-lg font-black text-white">个人设置</h3>
        </div>
        <PasswordChangeForm />
      </section>
    </div>
  );
}
