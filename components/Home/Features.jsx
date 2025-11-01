"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Smartphone,
  Zap,
  Users,
  Shield,
  TrendingUp,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <Smartphone className="h-10 w-10" />,
    title_ar: "تجربة موبايل سلسة",
    title_en: "Smooth Mobile Experience",
    description_ar: "واجهة متجاوبة تعمل بشكل مثالي على جميع الأجهزة",
    description_en: "Responsive design that works seamlessly on all devices",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title_ar: "سرعة فائقة",
    title_en: "Blazing Fast",
    description_ar: "معالجة الطلبات بشكل فوري وتحديثات لحظية",
    description_en: "Instant order processing and real-time updates",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title_ar: "إدارة شاملة",
    title_en: "Comprehensive Management",
    description_ar: "لوحة تحكم متكاملة للكاشير والمطبخ والإدارة",
    description_en: "Full control panel for cashier, kitchen, and management",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title_ar: "أمان وخصوصية",
    title_en: "Security & Privacy",
    description_ar: "حماية بيانات العملاء والمعاملات المالية",
    description_en: "Protects client data and financial transactions",
  },
  {
    icon: <TrendingUp className="h-10 w-10" />,
    title_ar: "تقارير تحليلية",
    title_en: "Analytical Reports",
    description_ar: "إحصائيات مفصلة لأداء المطعم والمبيعات",
    description_en: "Detailed performance and sales analytics",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title_ar: "دعم متعدد اللغات",
    title_en: "Multilingual Support",
    description_ar: "واجهة بالعربية والإنجليزية لجميع العملاء",
    description_en: "Arabic and English interface for all users",
  },
];

const Features = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section id="features" className="relative pt-16">
      <div className="container mx-auto px-4">
        {/* العنوان والوصف */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-cairo mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {isAr ? "لماذا نظامنا؟" : "Why Choose Our System?"}
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground font-cairo max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {isAr
              ? "نوفر لك جميع الأدوات اللازمة لإدارة مطعمك بكفاءة واحترافية"
              : "We provide all the tools you need to manage your restaurant efficiently and professionally"}
          </motion.p>
        </div>

        {/* الكروت */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-primary mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold font-cairo mb-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {isAr ? feature.title_ar : feature.title_en}
              </h3>
              <p className="text-muted-foreground font-cairo leading-relaxed">
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
