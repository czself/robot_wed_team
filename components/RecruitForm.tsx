"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const GROUPS = [
  { key: "mechanical", label: "机械组", desc: "结构设计 / 加工装配", icon: "⚙️" },
  { key: "embedded", label: "嵌入式组", desc: "嵌入式开发 / 硬件电路", icon: "🔌" },
  { key: "vision", label: "视觉组", desc: "计算机视觉 / 图像处理", icon: "👁️" },
  { key: "algorithm", label: "算法组", desc: "运动控制 / 导航算法", icon: "🧠" },
  { key: "operations", label: "运营组", desc: "宣传 / 策划 / 外联", icon: "📢" },
];

const GENDERS = ["男", "女", "其他"];

interface FormData {
  name: string;
  gender: string;
  phone: string;
  email: string;
  group: string;
  note: string;
}

const initialForm: FormData = {
  name: "",
  gender: "",
  phone: "",
  email: "",
  group: "",
  note: "",
};

export default function RecruitForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);

    if (!form.name.trim()) { setError("请填写姓名"); return; }
    if (!form.gender) { setError("请选择性别"); return; }
    if (!/^1[3-9]\d{9}$/.test(form.phone)) { setError("手机号格式不正确"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("邮箱格式不正确"); return; }
    if (!form.group) { setError("请选择意向组别"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/recruit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "提交失败");
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-xl mx-auto"
      >
        <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-10 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-rm-red/10 blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-rm-blue/10 blur-3xl opacity-60" />

          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rm-red to-rm-blue flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(217,4,41,0.3)]">
              ✓
            </div>
            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent mb-4">
              报名成功！
            </h2>
            <p className="text-rm-gray text-sm leading-relaxed max-w-sm mx-auto">
              感谢 {form.name} 的报名，我们已收到你的信息。
              <br />
              战队会尽快通过邮件/电话与你联系，请留意通知。
            </p>
            <button
              onClick={() => {
                setForm(initialForm);
                setSuccess(false);
                setError(null);
              }}
              className="mt-8 px-6 py-2.5 border border-rm-blue/40 hover:border-rm-blue text-rm-blue hover:bg-rm-blue/10 text-sm font-medium rounded-lg transition-colors"
            >
              再报一次
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-7 overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-rm-red/10 blur-3xl opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-rm-blue/10 blur-3xl opacity-60" />

        <div className="relative space-y-5">
          <div>
            <label className="block text-xs font-medium text-rm-gray mb-1.5 tracking-wider">
              姓名 <span className="text-rm-red">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="你的真实姓名"
              maxLength={24}
              className="w-full px-4 py-2.5 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-red/50 focus:ring-1 focus:ring-rm-red/30 outline-none transition-all text-sm placeholder:text-rm-gray/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-rm-gray mb-1.5 tracking-wider">
              性别 <span className="text-rm-red">*</span>
            </label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update("gender", g)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    form.gender === g
                      ? "bg-rm-blue/20 text-rm-blue border-rm-blue/40 shadow-[0_0_12px_rgba(0,200,255,0.2)]"
                      : "bg-rm-dark/60 text-rm-gray border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-rm-gray mb-1.5 tracking-wider">
              电话 <span className="text-rm-red">*</span>
            </label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="手机号码"
              maxLength={11}
              className="w-full px-4 py-2.5 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-red/50 focus:ring-1 focus:ring-rm-red/30 outline-none transition-all text-sm placeholder:text-rm-gray/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-rm-gray mb-1.5 tracking-wider">
              邮箱 <span className="text-rm-red">*</span>
            </label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="QQ 邮箱或其他常用邮箱"
              type="email"
              className="w-full px-4 py-2.5 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-blue/50 focus:ring-1 focus:ring-rm-blue/30 outline-none transition-all text-sm placeholder:text-rm-gray/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-rm-gray mb-2 tracking-wider">
              意向组别 <span className="text-rm-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => update("group", g.key)}
                  className={`text-left p-3 rounded-lg transition-all border ${
                    form.group === g.key
                      ? "bg-gradient-to-r from-rm-red/10 to-rm-blue/10 border-rm-red/40 shadow-[0_0_16px_rgba(217,4,41,0.15)]"
                      : "bg-rm-dark/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">{g.icon}</span>
                    <span
                      className={`text-sm font-bold ${
                        form.group === g.key ? "text-white" : "text-rm-gray"
                      }`}
                    >
                      {g.label}
                    </span>
                    {form.group === g.key && (
                      <span className="ml-auto text-rm-red text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-rm-gray/60 pl-7">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-rm-gray mb-1.5 tracking-wider">
              备注 <span className="text-rm-gray/40">（选填）</span>
            </label>
            <textarea
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="个人简介、技能、获奖经历等..."
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-rm-dark/60 border border-white/10 focus:border-rm-blue/50 focus:ring-1 focus:ring-rm-blue/30 outline-none transition-all text-sm placeholder:text-rm-gray/60 resize-none"
            />
            <div className="text-right mt-1">
              <span className="text-[11px] text-rm-gray/60 font-mono">
                {form.note.length}/200
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2.5 rounded-lg bg-rm-red/10 border border-rm-red/30 text-rm-red text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-rm-red to-rm-blue text-white text-sm font-bold rounded-lg transition-all hover:shadow-[0_0_32px_rgba(217,4,41,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                提交中...
              </>
            ) : (
              "提交报名 🚀"
            )}
          </button>

          <p className="text-center text-[11px] text-rm-gray/50 font-mono">
            提交即表示你同意我们将你的信息用于招新联系
          </p>
        </div>
      </motion.div>
    </div>
  );
}