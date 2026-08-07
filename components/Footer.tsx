"use client";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/totrytakeoff/RM2026/tree/new/basic_framework" },
  { label: "Bilibili", href: "#" },
  { label: "QQ群", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-rm-red flex items-center justify-center font-bold text-xs">
                YZ
              </div>
              <span className="text-lg font-bold tracking-wider">
                YZ CONTROL
              </span>
            </div>
            <p className="text-rm-gray text-sm leading-relaxed max-w-md">
              Future Starts Here. 未来，从这里开始。
              <br />
              RoboMaster 2026 步兵对抗赛国二 · 3v3 国三
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-4">
              联系方式
            </h4>
            <div className="space-y-2 text-sm text-rm-gray">
              <p>豫章师范学院</p>
              <p>红角洲校区</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-4">
              关注我们
            </h4>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-rm-gray hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-rm-gray">
            © {new Date().getFullYear()} YZ Control. All rights reserved.
          </p>
          <p className="text-xs text-rm-gray">
            Built with ❤️ and 🔧
          </p>
        </div>
      </div>
    </footer>
  );
}