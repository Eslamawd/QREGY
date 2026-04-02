"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  MapPinned,
  ShoppingCart,
  ChefHat,
  Wallet,
  BarChart3,
  TrendingUp,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: <MapPinned className="h-10 w-10" />,
    title_ar: "طلبات باللوكيشن من أي مكان",
    title_en: "Location-based Orders Anywhere",
    description_ar:
      "عميلك يطلب من أي مكان مع تحديد الموقع، والطلب يوصل فوراً للنظام.",
    description_en:
      "Customers can place location-based orders from anywhere, instantly synced to your system.",
  },
  {
    icon: <ShoppingCart className="h-10 w-10" />,
    title_ar: "تجربة طلب أسرع",
    title_en: "Faster Ordering Experience",
    description_ar: "منيو واضح وإضافات ذكية تساعد العميل يخلص الطلب بسرعة.",
    description_en:
      "Clear menus and smart add-ons that help customers checkout faster.",
  },
  {
    icon: <ChefHat className="h-10 w-10" />,
    title_ar: "تشغيل مباشر للمطبخ",
    title_en: "Live Kitchen Operations",
    description_ar:
      "الطلبات تدخل للمطبخ لحظياً مع تتبع حالة التنفيذ في الوقت الحقيقي.",
    description_en:
      "Orders flow to kitchen screens in real time with live status tracking.",
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    title_ar: "كاشير ودفع متكامل",
    title_en: "Integrated Cashier & Payments",
    description_ar: "إدارة المدفوعات والفواتير بسهولة داخل نفس سير العمل.",
    description_en:
      "Handle billing and payments smoothly in the same operational flow.",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title_ar: "تحليلات تشغيل ومبيعات",
    title_en: "Operations & Sales Analytics",
    description_ar: "تقارير دقيقة تساعدك تعرف الأفضل مبيعاً وتطور قراراتك.",
    description_en:
      "Detailed insights to track top sellers and improve business decisions.",
  },
  {
    icon: <Languages className="h-10 w-10" />,
    title_ar: "واجهة متعددة اللغات",
    title_en: "Multilingual Interface",
    description_ar: "تجربة عربية وإنجليزية جاهزة لكل نوع من العملاء.",
    description_en:
      "Arabic and English experiences ready for all customer types.",
  },
];

const Features = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section id="features" className="relative pt-16 md:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-56 max-w-5xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_70%)]" />
      <div className="container mx-auto px-4">
        {/* العنوان والوصف */}
        <div className="mb-12 text-center md:mb-16">
          <motion.span
            className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-cyan-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isAr
              ? "نظام كامل من الطلب للتشغيل"
              : "From ordering to operations"}
          </motion.span>

          <motion.h2
            className="mt-4 mb-4 text-3xl font-bold font-cairo md:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {isAr ? "ليه QREGY خيارك الأقوى؟" : "Why QREGY Stands Out"}
          </motion.h2>

          <motion.p
            className="mx-auto max-w-3xl text-base text-muted-foreground font-cairo md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            {isAr
              ? "منصة موحدة للطلبات باللوكيشن، إدارة الكاشير والمطبخ، وتحسين المبيعات بتجربة عميل سلسة على كل الأجهزة."
              : "A unified platform for location-based ordering, cashier and kitchen operations, and better sales through a seamless customer experience."}
          </motion.p>
        </div>

        {/* الكروت */}
        <div className="grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-6 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all duration-300 hover:border-cyan-300/35 md:p-7"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, rotateX: -4, rotateY: 4 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <motion.div
                className="mb-4 text-cyan-300"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="mb-3 bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-lg font-bold font-cairo text-transparent md:text-xl">
                {isAr ? feature.title_ar : feature.title_en}
              </h3>
              <p className="font-cairo leading-relaxed text-slate-200/90">
                {isAr ? feature.description_ar : feature.description_en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
