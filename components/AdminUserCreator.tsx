"use client";

import { useState } from "react";
import {
  KeyRound,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import type { PublicTeamUser, UserRole, UserStatus } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH, validatePassword } from "@/lib/security";
import { DEFAULT_TEAM_GROUP, TEAM_GROUPS } from "@/data/team-directions";

const groups = TEAM_GROUPS;

export default function AdminUserCreator({
  initialUsers,
  currentUserId,
}: {
  initialUsers: PublicTeamUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    group: DEFAULT_TEAM_GROUP,
    role: "member" as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const activeCount = users.filter((user) => user.status === "active").length;
  const disabledCount = users.length - activeCount;
  const filteredUsers = users.filter((user) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [user.username, user.name, user.group, user.role, user.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesGroup = groupFilter === "all" || user.group === groupFilter;
    return matchesQuery && matchesStatus && matchesGroup;
  });

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const patchUser = async (
    id: string,
    patch: Partial<Pick<PublicTeamUser, "name" | "group" | "status" | "role">> & {
      password?: string;
    }
  ) => {
    if (updatingId) return;
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch("/api/portal/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "更新失败");
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? json.data : user))
      );
      if (patch.password) {
        setPasswordDrafts((prev) => ({ ...prev, [id]: "" }));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeUser = async (user: PublicTeamUser) => {
    if (updatingId) return;
    const ok = window.confirm(`确认删除队员账号 ${user.name}（${user.username}）？`);
    if (!ok) return;

    setUpdatingId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/portal/users?id=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "删除失败");
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "创建失败");
      setUsers((prev) => [json.data, ...prev]);
      setForm({
        username: "",
        name: "",
        password: "",
        group: DEFAULT_TEAM_GROUP,
        role: "member",
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="accounts" className="space-y-5">
      <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">账号管理</h3>
            <p className="mt-1 text-sm text-rm-gray">
              集中查看、创建、停用、删除队员账号，并可重置密码。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-rm-dark/70 px-4 py-3">
            <div className="font-mono text-xl font-black text-white">{users.length}</div>
            <div className="text-xs text-rm-gray">总账号</div>
          </div>
          <div className="rounded-lg border border-rm-blue/20 bg-rm-blue/10 px-4 py-3">
            <div className="font-mono text-xl font-black text-rm-blue">{activeCount}</div>
            <div className="text-xs text-rm-gray">启用</div>
          </div>
          <div className="rounded-lg border border-rm-red/20 bg-rm-red/10 px-4 py-3">
            <div className="font-mono text-xl font-black text-rm-red">{disabledCount}</div>
            <div className="text-xs text-rm-gray">停用</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rm-red/30 bg-rm-red/10 text-rm-red">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-white">创建队员账号</h3>
            <p className="text-xs text-rm-gray">
              设置临时强密码，队员首次登录后必须修改
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            inputMode="numeric"
            placeholder="学号 / 用户名"
            className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
          />
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="姓名"
            className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
          />
          <input
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            type="password"
            placeholder={`初始密码，至少 ${MIN_PASSWORD_LENGTH} 位且含字母和数字`}
            className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-red/50"
          />
          <div>
            <select
              value={form.group}
              onChange={(e) => update("group", e.target.value as (typeof groups)[number])}
              className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-blue/50"
            >
              {groups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </div>
          <select
            value={form.role}
            onChange={(e) => update("role", e.target.value as UserRole)}
            className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-blue/50"
          >
            <option value="member">普通队员</option>
            <option value="admin">管理员</option>
          </select>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={
            loading ||
            !form.username.trim() ||
            !form.name.trim() ||
            Boolean(validatePassword(form.password))
          }
          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rm-red px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-40"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          创建账号
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 p-4">
          <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-sm font-bold text-white">
                已有队员账号 · {filteredUsers.length}/{users.length}
              </div>
              <div className="mt-1 text-xs text-rm-gray">
                修改姓名和组别后需要点击保存；停用后该账号不能登录。
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_120px_120px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rm-gray" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索学号、姓名、组别、权限"
                  className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 pl-10 pr-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)}
                className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-blue/50"
              >
                <option value="all">全部状态</option>
                <option value="active">启用</option>
                <option value="disabled">停用</option>
              </select>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-blue/50"
              >
                <option value="all">全部组别</option>
                {groups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="hidden grid-cols-[1.1fr_100px_90px_100px_160px_180px] gap-3 px-3 pt-2 text-xs font-bold uppercase tracking-[0.14em] text-rm-gray xl:grid">
            <div>账号 / 姓名</div>
            <div>组别</div>
            <div>权限</div>
            <div>状态</div>
            <div>重置密码</div>
            <div>操作</div>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid gap-3 px-4 py-4 text-sm text-rm-gray xl:grid-cols-[1.1fr_100px_90px_100px_160px_180px]"
            >
              <div>
                <input
                  value={user.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setUsers((prev) =>
                      prev.map((item) =>
                        item.id === user.id ? { ...item, name } : item
                      )
                    );
                  }}
                  className="h-9 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm font-bold text-white outline-none focus:border-rm-blue/50"
                />
                <div className="font-mono text-xs">
                  {user.username}
                </div>
                {user.mustChangePassword && (
                  <div className="mt-1 text-[11px] text-rm-red">等待修改初始密码</div>
                )}
              </div>
              <select
                value={user.group}
                onChange={(e) =>
                  setUsers((prev) =>
                    prev.map((item) =>
                      item.id === user.id ? { ...item, group: e.target.value } : item
                    )
                  )
                }
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-blue/50"
              >
                {groups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
              <select
                value={user.role}
                onChange={(e) =>
                  void patchUser(user.id, { role: e.target.value as UserRole })
                }
                disabled={updatingId === user.id || user.id === currentUserId}
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-xs text-white outline-none focus:border-rm-blue/50 disabled:opacity-50"
                aria-label={`${user.name}的账号权限`}
              >
                <option value="member">队员</option>
                <option value="admin">管理员</option>
              </select>
              <select
                value={user.status}
                onChange={(e) =>
                  void patchUser(user.id, { status: e.target.value as UserStatus })
                }
                disabled={updatingId === user.id || user.id === currentUserId}
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-red/50 disabled:opacity-50"
              >
                <option value="active">启用</option>
                <option value="disabled">停用</option>
              </select>
              <div className="flex gap-2">
                <input
                  value={passwordDrafts[user.id] || ""}
                  onChange={(e) =>
                    setPasswordDrafts((prev) => ({
                      ...prev,
                      [user.id]: e.target.value,
                    }))
                  }
                  type="password"
                  placeholder={`至少 ${MIN_PASSWORD_LENGTH} 位`}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
                />
                <button
                  type="button"
                  onClick={() =>
                    void patchUser(user.id, {
                      password: passwordDrafts[user.id] || "",
                    })
                  }
                  disabled={
                    updatingId === user.id ||
                    Boolean(validatePassword(passwordDrafts[user.id] || ""))
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue transition-colors hover:bg-rm-blue/15 disabled:opacity-40"
                  aria-label="重置密码"
                  title="重置密码"
                >
                  <KeyRound className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void patchUser(user.id, {
                      name: user.name,
                      group: user.group,
                    })
                  }
                  disabled={updatingId === user.id}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-rm-blue/40 bg-rm-blue/10 px-3 text-sm font-bold text-rm-blue transition-colors hover:bg-rm-blue/15 disabled:opacity-40"
                >
                  {updatingId === user.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => void removeUser(user)}
                  disabled={updatingId === user.id || user.id === currentUserId}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rm-red/40 bg-rm-red/10 px-3 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </button>
              </div>
            </div>
          ))}
          {!filteredUsers.length && (
            <div className="px-4 py-12 text-center text-sm text-rm-gray">
              没有匹配的队员账号
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
