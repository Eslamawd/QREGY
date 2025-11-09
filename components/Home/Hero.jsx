"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QrCode, ShoppingCart, ChefHat, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const Hero = () => {
  const { lang } = useLanguage();
  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "مسح QR Code",
      title_en: "QR Code Scanning",
      description: "قوائم فورية بمسح الكود",
      description_en: "Instant menus by scanning the code",
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "طلبات سريعة",
      title_en: "Fast Ordering",
      description: "نظام طلبات سهل وسريع",
      description_en: "Easy and fast ordering system",
    },
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: "شاشة المطبخ",
      title_en: "Kitchen Display",
      description: "إدارة الطلبات لحظياً",
      description_en: "Real-time order management",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "تقارير ذكية",
      title_en: "Smart Reports",
      description: "تحليلات وإحصائيات دقيقة",
      description_en: "Accurate analytics and statistics",
    },
  ];

  return (
    <section className="relative py-16 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="container mx-auto px-4 py-20 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold ">
              <span className="animate-gradient bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent bg-[length:200%_200%]">
                {lang === "ar" ? "نظام القوائم الذكية" : "Smart Menu System"}
              </span>
              <br />
              <span className="text-foreground">
                {lang === "ar" ? "للمطاعم الحديثة" : "For Modern Restaurants"}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-cairo">
              {lang === "ar"
                ? "حوّل مطعمك إلى تجربة رقمية عصرية. قوائم تفاعلية، طلبات سريعة، وإدارة احترافية."
                : "Transform your restaurant into a modern digital experience. Interactive menus, fast orders, and professional management."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end pt-4">
              {/* Primary Button */}
              <Link href={"/register"}>
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 shadow-button hover:shadow-lg transition-all font-cairo font-semibold bg-gradient-to-r from-emerald-400 to-cyan-500 text-white"
                >
                  <QrCode className="w-16 h-16" />
                  {lang === "ar" ? "ابدأ الآن مجاناً" : "Begin Now for Free"}
                </Button>
              </Link>

              {/* Secondary Outline Gradient Button */}
              <span className="text-lg h-14 px-8 font-cairo font-semibold flex justify-center text-center rounded-4xl items-center border-2 relative overflow-hidden group">
                <Link href={"/details"}>
                  <span className="relative text-emerald-400 group-hover:text-cyan-500 transition">
                    {lang === "ar" ? "شاهد العرض التوضيحي" : "Watch Demo"}
                  </span>
                </Link>
              </span>
            </div>
          </motion.div>

          {/* Features Grid with Motion Delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                dir={lang === "ar" ? "rtl" : "ltr"}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <FeatureCard {...feature} lang={lang} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  lang,
  title_en,
  description_en,
}) => {
  return (
    <div className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <div className="text-primary group-hover:text-emerald-600 transition-colors mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">
        {lang === "ar" ? title : title_en}
      </h3>
      <p className="text-sm text-muted-foreground">
        {lang === "ar" ? description : description_en}
      </p>
    </div>
  );
};

export default Hero;
