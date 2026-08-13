import RecruitForm from "@/components/RecruitForm";

export const metadata = {
  title: "招新报名",
  description:
    "了解并报名加入 YZ Control 战队的机械、嵌入式、视觉、算法与运营方向。",
};

export const dynamic = "force-dynamic";

const tracks = [
  {
    name: "机械组",
    role: "结构设计、加工装配、机构调试",
    starter: "SolidWorks / 机械制图 / 3D 打印",
    work: "负责底盘、云台、发射机构、整车装配与可靠性优化。",
  },
  {
    name: "嵌入式组",
    role: "电控固件、传感器、运动控制",
    starter: "C 语言 / STM32 / PID / CAN",
    work: "负责底盘、云台、发射机构控制，让机器人稳定响应操作。",
  },
  {
    name: "视觉组",
    role: "识别、追踪、自瞄与部署",
    starter: "Python / OpenCV / Linux / C++",
    work: "负责装甲板识别、目标追踪、弹道补偿和上车部署。",
  },
  {
    name: "算法组",
    role: "导航、决策、路径规划",
    starter: "数学基础 / Python / ROS 思维",
    work: "负责自动巡逻、目标决策、策略优化和仿真验证。",
  },
  {
    name: "运营组",
    role: "宣传、摄影、剪辑、外联",
    starter: "文案 / 设计 / 视频 / 沟通",
    work: "负责战队账号、赛事记录、招新宣传、赞助和活动组织。",
  },
];

const facts = [
  { label: "适合对象", value: "大一大二优先，零基础可报名" },
  { label: "投入时间", value: "每周固定训练 + 项目协作" },
  { label: "培养方式", value: "学长带入门，任务制训练" },
  { label: "报名反馈", value: "提交后负责人联系确认" },
];

const timeline = [
  ["01", "在线报名", "填写基础信息和意向组别"],
  ["02", "方向交流", "了解基础、兴趣和可投入时间"],
  ["03", "入门任务", "完成对应方向的小任务"],
  ["04", "训练营", "系统学习并参与真实机器人模块"],
  ["05", "正式队员", "进入赛季项目，参与备赛和比赛"],
];

const faqs = [
  ["零基础可以吗？", "可以。更看重持续学习、动手意愿和稳定投入。"],
  ["不知道选哪个组怎么办？", "先按最感兴趣的方向报名，交流后可以调整。"],
  ["会影响课程吗？", "战队会有固定训练节奏，但需要你能管理课余时间。"],
  ["报名后下一步是什么？", "负责人会通过你填写的电话或邮箱联系，确认交流安排。"],
];

export default function RecruitPage() {
  return (
    <main className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div
        className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-rm-red/10 blur-[140px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-rm-blue/10 blur-[140px] pointer-events-none"
        aria-hidden
      />

      <section className="relative px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-12 items-start">
          <div className="pt-8">
            <p className="text-sm tracking-[0.3em] uppercase mb-5">
              <span className="text-rm-red">Recruit</span>{" "}
              <span className="text-rm-blue">2026</span>
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight max-w-4xl">
              加入 YZ Control，
              <span className="block bg-gradient-to-r from-rm-red via-white to-rm-blue bg-clip-text text-transparent">
                从零造一台能上场的机器人
              </span>
            </h1>
            <p className="mt-6 text-rm-gray text-base md:text-lg leading-relaxed max-w-2xl">
              面向对机器人、工程实践、赛事运营感兴趣的同学。不会可以学，关键是愿意动手、愿意复盘、愿意和团队一起把机器调到能打。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#form"
                className="px-7 py-3 bg-rm-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_32px_rgba(217,4,41,0.35)]"
              >
                立即报名
              </a>
              <a
                href="#tracks"
                className="px-7 py-3 border border-rm-blue/40 hover:border-rm-blue text-rm-blue hover:bg-rm-blue/10 font-bold rounded-lg transition-colors"
              >
                查看方向
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
              {facts.map((item) => (
                <div
                  key={item.label}
                  className="border border-white/5 bg-white/[0.02] rounded-lg p-4"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-rm-gray/60 mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="form" className="scroll-mt-28">
            <RecruitForm />
          </div>
        </div>
      </section>

      <section id="tracks" className="relative px-6 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-sm tracking-[0.3em] uppercase mb-4">
              <span className="text-rm-red">Choose</span>{" "}
              <span className="text-rm-blue">Track</span>
            </p>
            <h2 className="text-3xl md:text-5xl font-black">选择你的方向</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {tracks.map((track) => (
              <article
                key={track.name}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-5 hover:border-rm-red/30 hover:bg-rm-red/[0.03] transition-colors"
              >
                <h3 className="text-xl font-black text-white mb-2">
                  {track.name}
                </h3>
                <p className="text-sm text-rm-blue mb-4">{track.role}</p>
                <p className="text-sm text-rm-gray leading-relaxed mb-5">
                  {track.work}
                </p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-rm-gray/50 mb-2">
                    入门起点
                  </p>
                  <p className="text-sm font-mono text-rm-red">
                    {track.starter}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase mb-4">
              <span className="text-rm-red">Next</span>{" "}
              <span className="text-rm-blue">Steps</span>
            </p>
            <h2 className="text-3xl md:text-5xl font-black mb-8">报名之后</h2>
            <div className="space-y-4">
              {timeline.map(([step, title, desc]) => (
                <div
                  key={step}
                  className="grid grid-cols-[56px_1fr] gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-lg border border-rm-red/40 bg-rm-red/10 flex items-center justify-center text-rm-red font-black">
                    {step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="text-sm text-rm-gray mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm tracking-[0.3em] uppercase mb-4">
              <span className="text-rm-red">FAQ</span>{" "}
              <span className="text-rm-blue">Answer</span>
            </p>
            <h2 className="text-3xl md:text-5xl font-black mb-8">常见问题</h2>
            <div className="space-y-3">
              {faqs.map(([question, answer]) => (
                <div
                  key={question}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-5"
                >
                  <h3 className="font-bold text-white mb-2">{question}</h3>
                  <p className="text-sm text-rm-gray leading-relaxed">
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
