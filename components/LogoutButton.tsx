"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-rm-gray transition-colors hover:border-rm-red/40 hover:text-rm-red disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "退出中" : "退出"}
    </button>
  );
}
