"use client";

import { useState } from "react";
import { KeyRound, Plus, RefreshCw, Save, Trash2, UserPlus } from "lucide-react";
import type { PublicTeamUser, UserRole, UserStatus } from "@/lib/auth";

const groups = ["机械组", "嵌入式组", "视觉组", "算法组", "运营组", "综合"];

export default function AdminUserCreator({
  initialUsers,
}: {
  initialUsers: PublicTeamUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "member" as UserRole,
    group: "嵌入式组",
  });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const patchUser = async (
    id: string,
    patch: Partial<Pick<PublicTeamUser, "name" | "role" | "group" | "status">> & {
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
    const ok = window.confirm(`确认删除队员账号 ${user.name}（${user.email}）？`);
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
        email: "",
        name: "",
        password: "",
        role: "member",
        group: "嵌入式组",
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rm-red/30 bg-rm-red/10 text-rm-red">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-white">创建队员账号</h3>
            <p className="text-xs text-rm-gray">账号不开放游客自助注册</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            type="email"
            placeholder="邮箱"
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
            placeholder="初始密码，至少 6 位"
            className="h-10 w-full rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-red/50"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.group}
              onChange={(e) => update("group", e.target.value)}
              className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-blue/50"
            >
              {groups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none focus:border-rm-red/50"
            >
              <option value="member">队员</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rm-red px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-40"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          创建账号
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-4 py-3 text-sm font-bold text-white">
          已有账号 · {users.length}
        </div>
        <div className="divide-y divide-white/5">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid gap-3 px-4 py-4 text-sm text-rm-gray xl:grid-cols-[1.1fr_120px_110px_100px_220px_260px]"
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
                <div className="font-mono text-xs">{user.email}</div>
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
                  setUsers((prev) =>
                    prev.map((item) =>
                      item.id === user.id
                        ? { ...item, role: e.target.value as UserRole }
                        : item
                    )
                  )
                }
                className="h-9 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none focus:border-rm-red/50"
              >
                <option value="member">队员</option>
                <option value="admin">管理员</option>
              </select>
              <select
                value={user.status}
                onChange={(e) =>
                  void patchUser(user.id, { status: e.target.value as UserStatus })
                }
                disabled={updatingId === user.id}
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
                  placeholder="新密码"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-rm-dark/70 px-2 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
                />
                <button
                  type="button"
                  onClick={() =>
                    void patchUser(user.id, {
                      password: passwordDrafts[user.id] || "",
                    })
                  }
                  disabled={updatingId === user.id || !(passwordDrafts[user.id] || "").trim()}
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
                      role: user.role,
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
                  disabled={updatingId === user.id}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rm-red/40 bg-rm-red/10 px-3 text-sm font-bold text-rm-red transition-colors hover:bg-rm-red/15 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </button>
              </div>
            </div>
          ))}
          {!users.length && (
            <div className="px-4 py-12 text-center text-sm text-rm-gray">
              暂无队员账号
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
