"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserRound } from "lucide-react";

const navLinks = [
  { label: "首页", href: "/" },
  { label: "星图", href: "/tech" },
  { label: "关于", href: "/about" },
  { label: "留言墙", href: "/wall" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setLoggedIn(Boolean(json?.data));
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-rm-red to-rm-blue flex items-center justify-center font-bold text-xs">
            YZ
          </div>
          <span className="text-lg font-bold tracking-wider group-hover:text-rm-red transition-colors">
            YZ CONTROL
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-rm-gray hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-rm-red group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://www.robomaster.com/zh-CN"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 border border-rm-blue/40 hover:border-rm-blue text-rm-blue hover:bg-rm-blue/10 text-sm font-medium rounded transition-colors"
          >
            RM 官网 ↗
          </a>
          <Link
            href="/recruit"
            className="px-5 py-2 bg-rm-red hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          >
            加入我们
          </Link>
          <Link
            href={loggedIn ? "/portal" : "/login"}
            className="inline-flex items-center gap-2 px-5 py-2 border border-white/15 hover:border-rm-red/50 text-white text-sm font-medium rounded transition-colors"
          >
            {loggedIn ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loggedIn ? "队员空间" : "队员登录"}
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-lg overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-rm-gray hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.robomaster.com/zh-CN"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="px-5 py-2 border border-rm-blue/40 hover:border-rm-blue text-rm-blue hover:bg-rm-blue/10 text-sm font-medium rounded transition-colors text-center"
              >
                RM 官网 ↗
              </a>
              <Link
                href="/recruit"
                onClick={() => setMobileOpen(false)}
                className="px-5 py-2 bg-rm-red hover:bg-red-700 text-white text-sm font-medium rounded transition-colors text-center"
              >
                加入我们
              </Link>
              <Link
                href={loggedIn ? "/portal" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 border border-white/15 hover:border-rm-red/50 text-white text-sm font-medium rounded transition-colors text-center"
              >
                {loggedIn ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {loggedIn ? "队员空间" : "队员登录"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
