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
      className="pt-20 pb-10 text-white"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-cairo">
          {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-2xl overflow-hidden shadow-md bg-gray-800/50 backdrop-blur-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-lg font-medium text-gray-100 hover:text-orange-400 transition-colors"
              >
                <span className="text-start">
                  {isAr ? faq.question_ar : faq.question_en}
                </span>
                <span className="text-2xl">
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
                    className="px-5 pb-4 text-gray-300 leading-relaxed font-cairo"
                  >
                    {isAr ? faq.answer_ar : faq.answer_en}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
