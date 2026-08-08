import { kv } from "@vercel/kv";
import nodemailer from "nodemailer";

export interface RecruitEntry {
  id: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  group: string;
  note?: string;
  createdAt: number;
}

const ENTRIES_KEY = "recruit:entries";
const META_PREFIX = "recruit:entry:";

const GROUPS = ["mechanical", "embedded", "vision", "algorithm", "operations"];

function genId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function validateEntry(input: unknown): Omit<RecruitEntry, "id" | "createdAt"> | string {
  if (!input || typeof input !== "object") return "请求体无效";
  const b = input as Record<string, unknown>;
  const name = String(b.name ?? "").trim();
  const gender = String(b.gender ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const group = String(b.group ?? "").trim();
  const note = b.note ? String(b.note).trim().slice(0, 200) : "";

  if (!name || name.length > 24) return "姓名必填（最多 24 字）";
  if (gender !== "男" && gender !== "女" && gender !== "其他") return "性别无效";
  if (!/^1[3-9]\d{9}$/.test(phone)) return "手机号格式不正确";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "邮箱格式不正确";
  if (!GROUPS.includes(group)) return "意向组别无效";

  return { name, gender, phone, email, group, note };
}

export async function createEntry(input: Omit<RecruitEntry, "id" | "createdAt">): Promise<RecruitEntry> {
  const entry: RecruitEntry = {
    ...input,
    id: genId(),
    createdAt: Date.now(),
  };
  await kv.lpush(ENTRIES_KEY, entry.id);
  await kv.set(`${META_PREFIX}${entry.id}`, entry);
  return entry;
}

export async function listEntries(): Promise<RecruitEntry[]> {
  const ids = await kv.lrange(ENTRIES_KEY, 0, -1);
  if (!ids.length) return [];
  const metas = await kv.mget(...ids.map((id: string) => `${META_PREFIX}${id}`));
  const entries: RecruitEntry[] = [];
  for (const meta of metas) {
    if (meta && typeof meta === "object") {
      entries.push(meta as RecruitEntry);
    }
  }
  return entries;
}

const GROUP_LABELS: Record<string, string> = {
  mechanical: "机械组",
  embedded: "嵌入式组",
  vision: "视觉组",
  algorithm: "算法组",
  operations: "运营组",
};

export async function sendMailNotice(entry: RecruitEntry): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO;
  if (!host || !user || !pass || !to) {
    console.warn("SMTP env missing, skip mail");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const lines = [
    `姓名：${entry.name}`,
    `性别：${entry.gender}`,
    `电话：${entry.phone}`,
    `邮箱：${entry.email}`,
    `意向组别：${GROUP_LABELS[entry.group] || entry.group}`,
  ];
  if (entry.note) lines.push(`备注：${entry.note}`);
  lines.push(`提交时间：${new Date(entry.createdAt).toLocaleString("zh-CN")}`);

  const html = `
    <div style="font-family:-apple-system,'PingFang SC',sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#D90429,#00C8FF);padding:20px 24px;color:#fff">
        <div style="font-size:14px;letter-spacing:.2em;opacity:.85">YZ CONTROL · RECRUITMENT</div>
        <div style="font-size:20px;font-weight:800;margin-top:4px">收到一份新报名</div>
      </div>
      <div style="padding:20px 24px;font-size:14px;line-height:2;color:#111">
        ${lines
          .map((l) => `<div style="border-bottom:1px solid #f3f4f6;padding:4px 0">${l}</div>`)
          .join("")}
      </div>
      <div style="padding:12px 24px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center">
        YZ Control 战队招新系统 · 来自 yz-control.top
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"YZ Control 招新" <${user}>`,
    to,
    subject: `【新报名】${entry.name} · ${GROUP_LABELS[entry.group] || entry.group}`,
    text: lines.join("\n"),
    html,
  });
}
