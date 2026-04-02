"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { connectSocket, disconnectSocket } from "@/services/socket";
import {
  Activity,
  BarChart3,
  Building2,
  Contact,
  CreditCard,
  LogOut,
  Orbit,
  Plane,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

const DashboardScene = dynamic(
  () => import("@/components/dashboard/DashboardScene"),
  { ssr: false },
);

export default function AdminLayout({ children }) {
  const { lang } = useLanguage();
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (user.role !== "admin") {
      router.push("/");
    } else if (!user.verified) {
      router.push("/send-verified");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const socket = connectSocket();
    const handleConnect = () => setSocketReady(true);
    const handleDisconnect = () => setSocketReady(false);

    if (socket.connected) {
      setSocketReady(true);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      disconnectSocket();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("فشل تسجيل الخروج:", err);
    }
  };

  if (!user) return null;

  const menuItems = [
    {
      icon: BarChart3,
      href: "/admin",
      labelAr: "لوحة المعلومات",
      labelEn: "Dashboard",
      hintAr: "المشهد العام",
      hintEn: "Executive pulse",
    },
    {
      icon: Users,
      href: "/admin/customers",
      labelAr: "العملاء",
      labelEn: "Customers",
      hintAr: "المستخدمون والنشاط",
      hintEn: "Users and activity",
    },
    {
      icon: Building2,
      href: "/admin/subscriptions",
      labelAr: "الاشتراكات",
      labelEn: "Subscriptions",
      hintAr: "التجديد والفوترة",
      hintEn: "Renewals and billing",
    },
    {
      icon: Plane,
      href: "/admin/plan-sub",
      labelAr: "خطط الاشتراكات",
      labelEn: "Plans",
      hintAr: "إدارة الباقات",
      hintEn: "Package design",
    },
    {
      icon: CreditCard,
      href: "/admin/payments",
      labelAr: "المدفوعات",
      labelEn: "Payments",
      hintAr: "التسويات والتحصيل",
      hintEn: "Collections and settlements",
    },
    {
      icon: Contact,
      href: "/admin/contacts",
      labelAr: "الاتصالات",
      labelEn: "Contacts",
      hintAr: "الرسائل والطلبات",
      hintEn: "Messages and requests",
    },
    {
      icon: CreditCard,
      href: "/admin/withdraw",
      labelAr: "السحوبات",
      labelEn: "Withdrawals",
      hintAr: "التحويلات المالية",
      hintEn: "Payout reviews",
    },
  ];

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative mx-auto mt-12 max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden">
        <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-rose-500/16 blur-3xl dark:bg-rose-500/18" />
        <div className="absolute left-[12%] top-8 h-72 w-72 rounded-full bg-cyan-400/16 blur-3xl dark:bg-cyan-400/18" />
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/72 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.09)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b1120]/72 dark:shadow-[0_30px_90px_rgba(2,8,23,0.5)]"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/6 dark:text-slate-300">
                <Orbit className="h-3.5 w-3.5 text-rose-500 dark:text-rose-300" />
                {lang === "ar" ? "مركز قيادة الإدارة" : "Admin command center"}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl dark:text-white">
                  {lang === "ar"
                    ? "لوحة إدارة موحدة وسريعة"
                    : "Unified, high-signal admin panel"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300/88">
                  {lang === "ar"
                    ? "نفس اللغة البصرية الحديثة للداشبورد مع ثيم متسق، حركة أخف، وقناة socket جاهزة لمتابعة العمليات المباشرة."
                    : "The admin area now follows the same modern dashboard language with consistent theming, lighter motion, and a socket-ready live ops channel."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm dark:border-white/10 dark:bg-white dark:text-slate-950">
                  <Activity className="h-3.5 w-3.5" />
                  {lang === "ar" ? "تنقل أوضح" : "Sharper navigation"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/6 dark:text-slate-200">
                  {socketReady ? (
                    <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                  )}
                  {socketReady
                    ? lang === "ar"
                      ? "القناة المباشرة متصلة"
                      : "Live channel connected"
                    : lang === "ar"
                      ? "القناة المباشرة غير متاحة"
                      : "Live channel offline"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="rounded-full bg-rose-600 px-4 text-white hover:bg-rose-500"
              >
                <LogOut className="h-4 w-4" />
                {lang === "ar" ? "تسجيل الخروج" : "Logout"}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative min-h-[280px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,255,255,0.42))] p-4 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.82),rgba(15,23,42,0.42))] dark:shadow-[0_30px_90px_rgba(2,8,23,0.55)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(244,63,94,0.18),transparent_42%)]" />
          <DashboardScene className="relative h-[260px] w-full" />
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/78 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7 dark:shadow-[0_22px_80px_rgba(2,8,23,0.45)]">
            <div className="mb-3 px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                {lang === "ar" ? "التنقل" : "Navigation"}
              </p>
            </div>
            <nav className="space-y-2">
              {menuItems.map(
                ({ icon: Icon, href, labelAr, labelEn, hintAr, hintEn }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                        active
                          ? "border-slate-950 bg-slate-950 text-white shadow-lg dark:border-cyan-300/30 dark:bg-white/12"
                          : "border-transparent bg-slate-100/75 text-slate-700 hover:border-slate-200 hover:bg-white dark:bg-slate-900/55 dark:text-slate-200 dark:hover:border-white/10 dark:hover:bg-white/8"
                      }`}
                    >
                      <span
                        className={`rounded-xl p-2 ${active ? "bg-white/12" : "bg-white shadow-sm dark:bg-white/7"}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">
                          {lang === "ar" ? labelAr : labelEn}
                        </span>
                        <span
                          className={`block text-xs ${active ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {lang === "ar" ? hintAr : hintEn}
                        </span>
                      </span>
                    </Link>
                  );
                },
              )}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 rounded-[32px] border border-slate-200/80 bg-white/78 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6 dark:border-white/10 dark:bg-[#08101e]/72 dark:shadow-[0_28px_90px_rgba(2,8,23,0.5)]">
          {children}
        </main>
      </div>
    </motion.div>
  );
}
