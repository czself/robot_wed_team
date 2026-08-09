export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0A0A0A] py-10 px-6">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-rm-red to-rm-blue flex items-center justify-center font-bold text-xs">
            YZ
          </div>
          <span className="text-sm font-bold tracking-wider">
            YZ CONTROL
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-rm-gray">
          <a
            href="https://www.robomaster.com/zh-CN"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rm-blue transition-colors"
          >
            RoboMaster
          </a>
          <a
            href="https://space.bilibili.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rm-red transition-colors"
          >
            B站
          </a>
          <a
            href="/recruit"
            className="hover:text-rm-red transition-colors"
          >
            加入我们
          </a>
        </div>

        <p className="text-xs text-rm-gray/50">
          &copy; {new Date().getFullYear()} YZ Control. All rights reserved.
        </p>
      </div>
    </footer>
  );
}