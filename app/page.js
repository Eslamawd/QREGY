"use client";

import FAQ from "@/components/Home/FAQ";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import MenuSection from "@/components/Home/MenuSection";
import SubscriptionPlans from "@/components/Home/SubscriptionPlans";
import TestimonialsCarousel from "@/components/Home/TestimonialsCarousel";
import UsersCounterSection from "@/components/Home/UsersCounterSection";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto w-full max-w-[1320px] px-3 pb-12 pt-6 md:px-6 md:pb-20 md:pt-10">
      <section className="relative mb-8 overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-orange-500/20 via-amber-400/10 to-red-500/20 p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur md:mb-12 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-orange-400/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-8 h-48 w-48 rounded-full bg-red-400/25 blur-3xl" />

        <div className="relative z-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-orange-100/40 bg-black/30 px-4 py-1 text-xs font-semibold tracking-wide text-orange-100">
              {t("home.eyebrow")}
            </span>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight text-white md:text-4xl">
              {t("home.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-orange-50/90 md:text-base">
              {t("home.description")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full border border-black/20 bg-white px-5 py-2 text-sm font-bold text-zinc-900 transition hover:translate-y-[-1px] hover:bg-zinc-100"
              >
                {t("actions.start")}
              </Link>
              <Link
                href="/menu"
                className="rounded-full border border-white/40 bg-black/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/45"
              >
                {t("actions.previewMenu")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/20 bg-black/35 p-4 text-sm text-zinc-100 md:p-5">
            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
              <span>{t("home.metrics.menuSpeed")}</span>
              <strong className="text-emerald-300">+35%</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
              <span>{t("home.metrics.ordersLive")}</span>
              <strong className="text-cyan-300">
                {t("home.metrics.socketReady")}
              </strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
              <span>{t("home.metrics.launchReady")}</span>
              <strong className="text-orange-300">
                {t("home.metrics.operationsReady")}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <Hero />
      <Features />
      <FAQ />
      <UsersCounterSection />
      <SubscriptionPlans />
    </main>
  );
}
