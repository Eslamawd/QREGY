"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

function TestimonialsCarousel() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const testimonials = [
    {
      text_ar:
        "من يوم ما استخدمنا QR EGY والطلبات بقت أوضح وأسرع، والعميل يطلب بنفسه من الموبايل.",
      text_en:
        "Since we started using QR EGY, orders have become clearer and faster — customers can order directly from their phones.",
      name_ar: "محمود سالم",
      name_en: "Mahmoud Salem",
      role_ar: "صاحب مطعم مشويات",
      role_en: "BBQ Restaurant Owner",
    },
    {
      text_ar:
        "وفرت علينا طباعة المنيو وكمان بقى عندنا تقارير يومية عن المبيعات والطلبات.",
      text_en:
        "It saved us from printing menus and gave us daily sales and orders reports.",
      name_ar: "هالة عبد الرحمن",
      name_en: "Hala Abdelrahman",
      role_ar: "مديرة كافيه",
      role_en: "Café Manager",
    },
    {
      text_ar:
        "المنيو الرقمي بالعربي والإنجليزي سهل التجربة على عملائنا، والدعم الفني ممتاز.",
      text_en:
        "The digital menu in Arabic and English made it easy for our customers, and the support team is excellent.",
      name_ar: "أحمد كمال",
      name_en: "Ahmed Kamal",
      role_ar: "كوفي شوب",
      role_en: "Coffee Shop Owner",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section
      id="testimonials"
      className={`relative pt-16  ${isAr ? "rtl" : "ltr"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold font-cairo text-white mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {isAr ? "آراء عملاء QR EGY" : "QR EGY Customer Reviews"}
        </motion.h2>

        <div className="relative h-56 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-700 max-w-xl mx-auto"
            >
              <p className="text-lg text-gray-200 mb-4 leading-relaxed font-cairo">
                “
                {isAr
                  ? testimonials[index].text_ar
                  : testimonials[index].text_en}
                ”
              </p>
              <h4 className="font-bold text-white text-lg font-cairo">
                {isAr
                  ? testimonials[index].name_ar
                  : testimonials[index].name_en}
              </h4>
              <span className="text-sm text-indigo-400 font-cairo">
                {isAr
                  ? testimonials[index].role_ar
                  : testimonials[index].role_en}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ✅ Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === index ? "bg-indigo-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCarousel;
