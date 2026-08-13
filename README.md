# YZ Control 官网

这是 YZ Control RoboMaster 战队官网。项目分为公开官网和队员门户两部分：

- 公开官网：战队介绍、技术星图、机器人展示、招新报名、留言墙。
- 队员门户：登录后查看队内资料、项目索引、队内后台、报名记录和留言记录。

## 技术栈

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Vercel KV
- Nodemailer
- Framer Motion
- Vitest

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000。本地开发在未配置远程 KV 时会使用进程内存储；重启开发服务器后，这些临时数据会清空。

## 环境变量

生产环境必须配置持久化 KV：

```bash
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

只有同时显式配置以下变量时，系统才会在首次登录请求中初始化管理员。用户名必须是 6–20 位数字学号，密码必须为 10–72 位并同时包含字母和数字；首次登录后必须修改密码：

```bash
TEAM_ADMIN_USERNAME=20260001
TEAM_ADMIN_PASSWORD=replace-with-a-strong-bootstrap-password
```

报名邮件通知：

```bash
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
SMTP_TO=
```

完整模板见 [`.env.example`](./.env.example)。部署后可通过 `/api/health` 检查 KV 与邮件通知配置状态；生产环境缺少 KV 时，依赖数据的接口会明确返回 `503`，不会悄悄写入易失内存。

## 重要约束

- 队内资料不要放在 `public/`，否则知道路径的人都能访问。
- `/portal/*` 需要队员登录。
- 普通队员可查看队内资料，但不能访问账号、资料、报名和留言管理接口。
- `/portal/admin/*` 及对应管理接口只允许管理员访问。
- 管理员创建的新账号必须在首次登录后修改初始密码；重置密码、停用账号或变更权限会撤销该账号的现有会话。
- 不开放游客自助注册，也不提供固定默认账号或默认密码。

## 验证

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

同样的四项检查会在 GitHub Actions 中自动运行。
