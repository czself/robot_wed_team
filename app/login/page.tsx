import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "队员登录 · YZ Control",
  description: "YZ Control 战队官网队员空间登录。",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-rm-blue/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <section>
          <p className="mb-5 text-sm uppercase tracking-[0.3em]">
            <span className="text-rm-red">YZ Control</span>{" "}
            <span className="text-rm-blue">Official</span>
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            官网公开展示，
            <span className="block bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
              队内资料只给队员。
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-rm-gray">
            第一阶段队员空间用于沉淀训练路线、项目资料、报名管理和账号管理。游客仍可访问招新、战队介绍、技术星图等公开内容。
          </p>
        </section>

        <Suspense
          fallback={
            <div className="h-[360px] rounded-lg border border-white/10 bg-white/[0.03]" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
