import Link from "next/link";
import { BookOpen, ClipboardList, Database, ShieldCheck } from "lucide-react";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import { requireUser } from "@/lib/session";
import { listResources } from "@/lib/resources";

export const dynamic = "force-dynamic";

const modules = [
  {
    title: "资料库",
    desc: "沉淀训练路线、项目链接、规范和复盘资料。",
    href: "/portal/docs",
    icon: BookOpen,
  },
  {
    title: "训练任务",
    desc: "第一阶段预留模块，后续接入任务分配和进度记录。",
    href: "/portal/docs?level=入门",
    icon: ClipboardList,
  },
  {
    title: "项目资料",
    desc: "机器人项目、赛季文档、调试记录统一入口。",
    href: "/portal/docs?level=项目",
    icon: Database,
  },
  {
    title: "队内后台",
    desc: "队员维护账号、报名、留言和资料。",
    href: "/portal/admin",
    icon: ShieldCheck,
  },
];

export default async function PortalPage() {
  const user = await requireUser();
  const resources = await listResources();

  return (
    <div>
      <section className="mb-10">
        <p className="mb-4 text-sm uppercase tracking-[0.3em]">
          <span className="text-rm-red">Team</span>{" "}
          <span className="text-rm-blue">Workspace</span>
        </p>
        <h2 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
          从招新官网升级为
          <span className="block bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
            战队长期资料中枢
          </span>
        </h2>
      </section>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules
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
                  进入 →
                </div>
              </Link>
            );
          })}
      </div>

      <div className="mt-6">
        <PasswordChangeForm />
      </div>
    </div>
  );
}
