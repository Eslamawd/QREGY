"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QrCode, ShoppingCart, ChefHat, MapPinned } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const useSequentialTypewriter = (
  lines,
  {
    headlineTypingSpeed = 55,
    paragraphTypingSpeed = 22,
    deletingSpeed = 20,
    holdMs = 1700,
    linePauseMs = 240,
    restartPauseMs = 500,
  } = {},
) => {
  const [displayLines, setDisplayLines] = useState(["", "", ""]);
  const [mode, setMode] = useState("typing");
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    setDisplayLines(["", "", ""]);
    setMode("typing");
    setActiveLine(0);
  }, [lines]);

  useEffect(() => {
    const lastLineIndex = lines.length - 1;
    const currentText = lines[activeLine] || "";
    const currentDisplay = displayLines[activeLine] || "";

    let delay = deletingSpeed;
    if (mode === "typing") {
      delay =
        activeLine === lastLineIndex
          ? paragraphTypingSpeed
          : headlineTypingSpeed;
    } else if (mode === "holding") {
      delay = holdMs;
    } else if (mode === "restart") {
      delay = restartPauseMs;
    } else {
      delay = deletingSpeed;
    }

    const timer = setTimeout(
      () => {
        if (mode === "typing") {
          if (currentDisplay.length < currentText.length) {
            setDisplayLines((prev) => {
              const next = [...prev];
              next[activeLine] = currentText.slice(
                0,
                currentDisplay.length + 1,
              );
              return next;
            });
            return;
          }

          if (activeLine < lastLineIndex) {
            setActiveLine((line) => line + 1);
            return;
          }

          setMode("holding");
          return;
        }

        if (mode === "holding") {
          setMode("deleting");
          setActiveLine(lastLineIndex);
          return;
        }

        if (mode === "deleting") {
          if (currentDisplay.length > 0) {
            setDisplayLines((prev) => {
              const next = [...prev];
              next[activeLine] = currentDisplay.slice(
                0,
                currentDisplay.length - 1,
              );
              return next;
            });
            return;
          }

          if (activeLine > 0) {
            setActiveLine((line) => line - 1);
            return;
          }

          setMode("restart");
          return;
        }

        if (mode === "restart") {
          setMode("typing");
          setActiveLine(0);
        }
      },
      mode === "typing" && currentDisplay.length === currentText.length
        ? linePauseMs
        : delay,
    );

    return () => clearTimeout(timer);
  }, [
    activeLine,
    deletingSpeed,
    displayLines,
    headlineTypingSpeed,
    holdMs,
    lines,
    linePauseMs,
    mode,
    paragraphTypingSpeed,
    restartPauseMs,
  ]);

  const cursorLine =
    mode === "deleting" || mode === "holding" ? activeLine : activeLine;
  return { displayLines, cursorLine, isDeleting: mode === "deleting" };
};

const Hero = () => {
  const { lang } = useLanguage();
  const heroLines = useMemo(
    () =>
      lang === "ar"
        ? [
            "اطلب من أي مكان",
            "وشغّل مطعمك بذكاء",
            "عميلك يطلب حسب اللوكيشن من أي مكان، وانت تدير الطلبات والكاشير والمطبخ وتزود مبيعاتك من منصة واحدة.",
          ]
        : [
            "Order From Anywhere",
            "Run Your Restaurant Smarter",
            "Customers can order with location support from anywhere, while you manage orders, cashier, and kitchen from one unified platform.",
          ],
    [lang],
  );

  const { displayLines, cursorLine, isDeleting } =
    useSequentialTypewriter(heroLines);

  const renderLineWithCursor = (lineText, lineIndex, className = "") => (
    <span aria-label={heroLines[lineIndex]} className={className}>
      {lineText}
      {cursorLine === lineIndex && (
        <span
          aria-hidden="true"
          className={`ms-1 inline-block select-none text-current ${
            isDeleting ? "opacity-60" : "opacity-100"
          }`}
        >
          |
        </span>
      )}
    </span>
  );

  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "مسح QR Code",
      title_en: "QR Code Scanning",
      description: "قوائم فورية بمسح الكود",
      description_en: "Instant menus by scanning the code",
    },
    {
      icon: <MapPinned className="h-8 w-8" />,
      title: "طلب باللوكيشن",
      title_en: "Location-based Orders",
      description: "عميلك يطلب من أي مكان بسهولة",
      description_en: "Customers order from anywhere with location support",
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "بيع أسرع",
      title_en: "Faster Selling",
      description: "سلة طلب ذكية ومعدل تحويل أعلى",
      description_en: "Smart cart flow with higher conversion",
    },
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: "تشغيل كامل",
      title_en: "Full Operations",
      description: "إدارة المطبخ والكاشير والطلبات لحظياً",
      description_en: "Real-time kitchen, cashier, and order control",
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
                {renderLineWithCursor(displayLines[0], 0)}
              </span>
              <br />
              <span className="text-foreground">
                {renderLineWithCursor(displayLines[1], 1)}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-cairo">
              {renderLineWithCursor(displayLines[2], 2)}
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
          <div className="grid grid-cols-1 gap-6 [perspective:1200px] sm:grid-cols-2">
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
    <motion.div
      whileHover={{ rotateX: -5, rotateY: 5, y: -8 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-card"
    >
      <div className="text-primary group-hover:text-emerald-600 transition-colors mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">
        {lang === "ar" ? title : title_en}
      </h3>
      <p className="text-sm text-muted-foreground">
        {lang === "ar" ? description : description_en}
      </p>
    </motion.div>
  );
};

export default Hero;
