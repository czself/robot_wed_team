# YZ Control 官网

这是 YZ Control RoboMaster 战队官网。项目分为公开官网和队员门户两部分：

- 公开官网：战队介绍、技术星图、机器人展示、招新报名、留言墙。
- 队员门户：登录后查看队内资料、项目索引、管理员后台和报名记录。

## 技术栈

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Vercel KV
- Nodemailer
- Framer Motion / GSAP / Lenis

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 环境变量

基础门户账号会在第一次登录请求时自动初始化。管理员密码至少 6 位：

```bash
TEAM_ADMIN_EMAIL=admin@yz-control.local
TEAM_ADMIN_PASSWORD=change-this-password
```

兼容旧后台和留言删除接口。默认不启用 Bearer `ADMIN_KEY` 管理权限；确实需要过渡时显式打开：

```bash
ADMIN_KEY=legacy-admin-key
ALLOW_LEGACY_ADMIN_KEY=true
```

报名邮件通知：

```bash
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
SMTP_TO=
```

Vercel KV 变量由 Vercel 绑定提供，或在本地按 `@vercel/kv` 要求配置。

## 重要约束

- 队内资料不要放在 `public/`，否则知道路径的人都能访问。
- `/portal/*` 需要队员登录。
- `/portal/admin/*` 需要管理员账号。
- 管理员创建队员账号，不开放游客自助注册。

## 验证

```bash
npm run lint
npm run build
```
