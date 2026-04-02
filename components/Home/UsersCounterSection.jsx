"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Building2, ShoppingBag, Users } from "lucide-react";

function Counter({ start, minStep, maxStep, interval, label, icon, tone }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomStep =
        Math.floor(Math.random() * (maxStep - minStep + 1)) + minStep;
      setCount((prev) => prev + randomStep);
    }, interval);

    return () => clearInterval(timer);
  }, [minStep, maxStep, interval]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, rotateX: -4, rotateY: 4 }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-6 text-center shadow-[0_18px_45px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md"
    >
      <div
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 ${tone}`}
      >
        {icon}
      </div>
      <h3 className="text-3xl font-bold animate-gradient bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_200%] md:text-4xl">
        {count.toLocaleString()}
      </h3>
      <p className="mt-1 text-gray-200/90">{label}</p>
    </motion.div>
  );
}

function UsersCounterSection() {
  const { lang } = useLanguage();
  return (
    <section className="relative pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-2 mx-auto h-52 max-w-5xl bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_72%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="mb-3 text-center text-3xl font-bold text-white font-cairo md:text-4xl">
          {lang === "ar" ? "أرقام QR EGY اليوم" : "Today's QR EGY Numbers"}
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-sm text-gray-300 md:text-base">
          {lang === "ar"
            ? "نمو مستمر في المطاعم النشطة وحجم الطلبات اليومية وعدد العملاء المتفاعلين مع المنيو."
            : "Continuous growth in active restaurants, daily order volume, and customers interacting with your menu."}
        </p>
        <div className="grid gap-6 [perspective:1200px] md:grid-cols-3">
          <Counter
            start={250}
            minStep={1}
            maxStep={3}
            interval={3000}
            label={lang === "ar" ? "مطاعم مسجلة" : "Registered Restaurants"}
            icon={<Building2 className="h-5 w-5 text-emerald-300" />}
            tone="bg-emerald-400/10"
          />
          <Counter
            start={1200}
            minStep={5}
            maxStep={15}
            interval={2500}
            label={lang === "ar" ? "طلبات يومية" : "Daily Orders"}
            icon={<ShoppingBag className="h-5 w-5 text-cyan-300" />}
            tone="bg-cyan-400/10"
          />
          <Counter
            start={4800}
            minStep={10}
            maxStep={20}
            interval={2000}
            label={lang === "ar" ? "عملاء يستخدمون المنيو" : "Active Customers"}
            icon={<Users className="h-5 w-5 text-orange-300" />}
            tone="bg-orange-400/10"
          />
        </div>
      </div>
    </section>
  );
}

export default UsersCounterSection;
