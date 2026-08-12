import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BookOpen, FolderKanban, Shield, Users } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { requireUser } from "@/lib/session";

const navItems = [
  { href: "/portal", label: "总览", icon: FolderKanban },
  { href: "/portal/docs", label: "资料库", icon: BookOpen },
  { href: "/portal/admin", label: "后台", icon: Shield },
];

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  if (user.status !== "active") redirect("/login");

  return (
    <div className="min-h-screen bg-[#070707] pt-20">
      <div className="border-b border-white/10 bg-[#070707]/95 px-4 py-4 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rm-blue">
              Member Portal
            </p>
            <h1 className="mt-1 text-xl font-black text-white md:text-2xl">
              YZ Control 队员空间
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {navItems
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-rm-gray transition-colors hover:border-rm-blue/40 hover:text-rm-blue"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            <LogoutButton />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-rm-red to-rm-blue text-sm font-black text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-xs text-rm-gray">
                {user.group} · {user.role === "admin" ? "管理员" : "队员"}
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-rm-gray">
            <Users className="h-4 w-4 text-rm-blue" />
            {user.email}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
