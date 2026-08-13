"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, RefreshCw } from "lucide-react";
import { MIN_PASSWORD_LENGTH, validatePassword } from "@/lib/security";

export default function PasswordChangeForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (loading) return;
    setMessage(null);
    setError(null);
    if (nextPassword !== confirmPassword) {
      setError("两次输入的新密码不一致");
      return;
    }
    const passwordError = validatePassword(nextPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/portal/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, nextPassword }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "修改失败");

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setMessage("密码已修改，请使用新密码重新登录。");
      window.setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 800);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rm-blue/30 bg-rm-blue/10 text-rm-blue">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-black text-white">修改密码</h3>
          <p className="text-xs text-rm-gray">修改后当前登录会话会退出</p>
        </div>
      </div>

      <form
        className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <input
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
          placeholder="当前密码"
          aria-label="当前密码"
          autoComplete="current-password"
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-blue/50"
        />
        <input
          value={nextPassword}
          onChange={(e) => setNextPassword(e.target.value)}
          type="password"
          placeholder={`新密码，至少 ${MIN_PASSWORD_LENGTH} 位且含字母和数字`}
          aria-label="新密码"
          autoComplete="new-password"
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-red/50"
        />
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="确认新密码"
          aria-label="确认新密码"
          autoComplete="new-password"
          className="h-10 rounded-lg border border-white/10 bg-rm-dark/70 px-3 text-sm text-white outline-none placeholder:text-rm-gray/50 focus:border-rm-red/50"
        />
        <button
          type="submit"
          disabled={
            loading ||
            !currentPassword ||
            Boolean(validatePassword(nextPassword)) ||
            !confirmPassword
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-rm-blue px-4 text-sm font-bold text-white transition-colors hover:bg-cyan-600 disabled:opacity-40"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          保存
        </button>
      </form>

      {message && (
        <div aria-live="polite" className="mt-3 rounded-lg border border-rm-blue/30 bg-rm-blue/10 px-3 py-2 text-sm text-rm-blue">
          {message}
        </div>
      )}
      {error && (
        <div role="alert" className="mt-3 rounded-lg border border-rm-red/30 bg-rm-red/10 px-3 py-2 text-sm text-rm-red">
          {error}
        </div>
      )}
    </section>
  );
}
