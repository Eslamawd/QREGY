"use client";
import { User, LogOut, Settings, Menu } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import UserBalance from "../balance/UserBalance";
import { useCurrency } from "@/context/CurrencyContext";
import ThemeToggle from "./ThemeToggle";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/#how", label: t("nav.howItWorks") },
    { href: "/#features", label: t("nav.features") },
    { href: "/#faq", label: t("nav.faq") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full relative bg-slate-100 text-slate-700 dark:bg-[#0f1020] dark:text-gray-200"
    >
      <header className="fixed top-0 left-0 right-0 pb-2 z-50 backdrop-blur-md rounded-b-4xl shadow-lg shadow-emerald-500/5">
        <div className="mx-auto max-w-7xl px-4 pt-2 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-3">
            <div className=" font-bold  animate-gradient bg-gradient-to-r from-gray-400  to-gray-900 bg-clip-text text-transparent bg-[length:200%_200%] text-4xl">
              QR
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-gray-300">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="relative nav-link transition hover:text-slate-900 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle compact />

            {/* Language Toggle */}
            <span
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-400 hover:border-slate-500 text-sm transition cursor-pointer dark:border-gray-600 dark:hover:border-gray-400"
              role="button"
              aria-label={
                lang === "ar"
                  ? t("language.switchToEnglish")
                  : t("language.switchToArabic")
              }
              title={lang === "ar" ? "English" : "العربية"}
            >
              {lang === "ar" ? "EN" : "AR"}
            </span>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-xl border border-slate-300 bg-transparent px-1 text-sm dark:border-white/20"
            >
              <option className="bg-indigo-900" value="EGP">
                EGP
              </option>
              <option className="bg-indigo-900" value="USD">
                USD
              </option>
            </select>

            {/* Admin / Dashboard */}
            {user && user.role === "admin" && (
              <Link
                href="/admin"
                className="hidden rounded-xl border border-slate-300 px-4 py-2 transition hover:border-slate-500 md:block dark:border-gray-600 dark:hover:border-gray-400"
              >
                {lang === "ar" ? "إدارة" : "Admin"}
              </Link>
            )}

            {user ? (
              <>
                <UserBalance />
                <Link
                  href="/dashboard"
                  className="hidden rounded-xl border border-slate-300 px-4 py-2 transition hover:border-slate-500 md:block dark:border-gray-600 dark:hover:border-gray-400"
                >
                  {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-xl border border-slate-300 px-4 py-2 transition hover:border-slate-500 md:block dark:border-gray-600 dark:hover:border-gray-400"
                >
                  {t("actions.login")}
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 md:px-4 md:py-2 rounded-xl text-sm bg-gradient-to-l from-emerald-400 to-cyan-500 text-[#0f1020] font-semibold shadow-md hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition"
                >
                  {t("actions.register")}
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <span onClick={() => setMenuOpen(!menuOpen)}>
                <Menu className="h-7 w-7 text-slate-900 dark:text-white" />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 z-50 flex h-full w-2/3 flex-col gap-4 bg-slate-100 p-6 shadow-xl md:hidden dark:bg-[#181a2a]"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-slate-500 dark:border-white/15 dark:text-gray-200 dark:hover:border-white/40"
                >
                  {link.label}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Button
                  onClick={() => setMenuOpen(false)}
                  className="justify-between"
                >
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Settings className="w-4 h-4" />
                    {lang === "ar" ? "إدارة" : "Admin"}
                  </Link>
                </Button>
              )}

              {user ? (
                <>
                  <Button
                    onClick={() => setMenuOpen(false)}
                    className="justify-between"
                  >
                    <Link
                      href={"/dashboard"}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <User className="w-4 h-4" />
                      {user.name || (lang === "ar" ? "حسابي" : "My Account")}
                    </Link>
                  </Button>
                  <Button onClick={() => logout()} className="justify-center">
                    <div className="flex items-center justify-center gap-2 w-full">
                      <LogOut className="w-4 h-4" />
                      {lang === "ar" ? "تسجيل " : "LogOut"}
                    </div>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setMenuOpen(false)}
                  className="justify-center"
                >
                  <Link
                    href={"/login"}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <User className="w-4 h-4" />
                    {t("actions.login")}
                  </Link>
                </Button>
              )}

              {/* Other Links */}
              <Button className="w-full">
                <Link href="/about" onClick={() => setMenuOpen(false)}>
                  {lang === "ar" ? "عنّا" : "About Us"}
                </Link>
              </Button>
            </motion.div>

            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
