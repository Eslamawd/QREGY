"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question_ar: "كيف يعمل نظام QR EGY؟",
    answer_ar:
      "بمجرد تسجيل مطعمك، تحصل على QR Code خاص. الزبون يمسح الكود، يفتح المنيو مباشرة، ويقدر يطلب أونلاين، والطلب يوصل للمطبخ فوراً.",
    question_en: "How does the QR EGY system work?",
    answer_en:
      "Once your restaurant is registered, you get a unique QR code. Customers scan it to open the menu instantly, place orders online, and the order goes directly to the kitchen.",
  },
  {
    question_ar: "هل أقدر أستقبل طلبات باللوكيشن من أي مكان؟",
    answer_ar:
      "نعم، العميل يقدر يطلب من أي مكان مع تحديد الموقع، والنظام يوصّل الطلب مباشرة للإدارة والمطبخ عشان تبدأ التنفيذ بسرعة.",
    question_en: "Can I receive location-based orders from anywhere?",
    answer_en:
      "Yes. Customers can place orders from anywhere with location details, and orders are pushed directly to your management and kitchen flow in real time.",
  },
  {
    question_ar: "هل النظام يدعم أكثر من لغة؟",
    answer_ar:
      "نعم ✅ النظام متوفر بالعربية والإنجليزية ليتناسب مع كل العملاء.",
    question_en: "Does the system support multiple languages?",
    answer_en:
      "Yes ✅ It’s available in both Arabic and English for all users.",
  },
  {
    question_ar: "هل أحتاج أجهزة خاصة لتشغيل النظام؟",
    answer_ar:
      "لا، يعمل على أي جهاز (موبايل، تابلت، أو كمبيوتر) ومتوافق مع جميع المتصفحات.",
    question_en: "Do I need special devices to use the system?",
    answer_en:
      "No, it works on any device (mobile, tablet, or computer) and supports all browsers.",
  },
  {
    question_ar: "هل يوجد فترة تجربة مجانية؟",
    answer_ar: "نعم، يمكنك تجربة النظام مجاناً قبل الاشتراك في أي خطة مدفوعة.",
    question_en: "Is there a free trial period?",
    answer_en:
      "Yes, you can try the system for free before subscribing to any plan.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      dir={isAr ? "rtl" : "ltr"}
      className="relative pt-20 pb-10 text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-8 mx-auto h-56 max-w-4xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_72%)]" />
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-cyan-200">
            {isAr
              ? "إجابات واضحة قبل الاشتراك"
              : "Clear answers before you subscribe"}
          </span>
          <h2 className="mt-4 text-3xl font-bold font-cairo md:text-4xl">
            {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="space-y-4 [perspective:1200px]">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              whileHover={{ rotateX: -3, rotateY: 3, y: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] shadow-[0_16px_40px_-22px_rgba(0,0,0,0.65)] backdrop-blur-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-4 text-base font-medium text-gray-100 transition-colors hover:text-cyan-300 md:p-5 md:text-lg"
              >
                <span className="text-start">
                  {isAr ? faq.question_ar : faq.question_en}
                </span>
                <span className="text-xl md:text-2xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 text-sm leading-relaxed text-gray-200/90 font-cairo md:px-5 md:text-base"
                  >
                    {isAr ? faq.answer_ar : faq.answer_en}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
