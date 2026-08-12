"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "登录失败");
      router.replace(searchParams.get("next") || "/portal");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rm-red/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-rm-blue/10 blur-3xl" />

      <div className="relative">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-rm-blue">
          Member Access
        </p>
        <h1 className="text-3xl font-black text-white">队员登录</h1>
        <p className="mt-3 text-sm leading-7 text-rm-gray">
          游客可以继续浏览公开官网。队员和管理员统一从这里登录，登录后可查看队内资料和后台记录。
        </p>

        <div className="mt-7 space-y-4">
          <label className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rm-gray" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="队员邮箱 / 管理员邮箱"
              className="h-11 w-full rounded-lg border border-white/10 bg-rm-dark/70 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-rm-gray/50 focus:border-rm-blue/50"
            />
          </label>

          <label className="relative block">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rm-gray" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              type="password"
              placeholder="密码"
              className="h-11 w-full rounded-lg border border-white/10 bg-rm-dark/70 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-rm-gray/50 focus:border-rm-red/50"
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rm-red/30 bg-rm-red/10 px-4 py-2 text-sm text-rm-red">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!email.trim() || !password || loading}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-rm-red px-5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogIn className="h-4 w-4" />
          {loading ? "登录中..." : "进入队员空间"}
        </button>
      </div>
    </div>
  );
}
