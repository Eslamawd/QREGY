"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    titleAr: "1. المقدمة",
    titleEn: "1. Introduction",
    contentAr: [
      "توضح هذه الصفحة شروط وأحكام استخدام نظام QR EGY لإدارة المطاعم والمقاهي، والذي يتيح إنشاء قوائم ذكية رقمية وتسهيل الطلبات وإدارة العمليات اليومية بشكل احترافي.",
    ],
    contentEn: [
      "This page outlines the terms and conditions for using the QR EGY system for restaurants and cafés, which provides smart digital menus, efficient order management, and professional daily operations.",
    ],
  },
  {
    titleAr: "2. استخدام النظام",
    titleEn: "2. Use of the System",
    contentAr: [
      "يجب استخدام النظام بطريقة قانونية ومشروعة تتماشى مع الأنظمة المحلية.",
      "يُمنع استخدام النظام لأي أغراض غير قانونية أو مسيئة أو تضر بالعملاء أو المستخدمين الآخرين.",
      "يحق للإدارة تعليق أو إلغاء الحساب في حال مخالفة الشروط.",
    ],
    contentEn: [
      "The system must be used legally and in accordance with local regulations.",
      "It is prohibited to use the system for unlawful, abusive, or harmful activities.",
      "The administration reserves the right to suspend or terminate accounts violating these terms.",
    ],
  },
  {
    titleAr: "3. الخصوصية وحماية البيانات",
    titleEn: "3. Privacy and Data Protection",
    contentAr: [
      "نلتزم بحماية بيانات المستخدمين والمطاعم وفقًا لأفضل الممارسات والمعايير التقنية الحديثة.",
      "لا يتم مشاركة أي معلومات شخصية أو تجارية مع أطراف خارجية إلا بموافقة مسبقة من صاحب الحساب.",
    ],
    contentEn: [
      "We are committed to protecting user and restaurant data in accordance with the latest security standards.",
      "No personal or business information is shared with third parties without prior consent from the account owner.",
    ],
  },
  {
    titleAr: "4. الاشتراكات والدفع",
    titleEn: "4. Subscriptions and Payments",
    contentAr: [
      "تُقدَّم بعض الخدمات ضمن النظام باشتراكات مدفوعة يتم تحديد قيمتها في واجهة المستخدم.",
      "لا تُسترد الرسوم بعد الدفع إلا في الحالات الاستثنائية الموضحة بسياسة الاسترجاع.",
    ],
    contentEn: [
      "Some system services are offered as paid subscriptions, displayed clearly within the dashboard.",
      "Payments are non-refundable except in exceptional cases stated in the refund policy.",
    ],
  },
  {
    titleAr: "5. التعديلات على الشروط",
    titleEn: "5. Amendments",
    contentAr: [
      "تحتفظ إدارة QR EGY بحق تعديل أو تحديث هذه الشروط في أي وقت.",
      "يُعد استمرار استخدام النظام بعد التعديل موافقة ضمنية على الشروط الجديدة.",
    ],
    contentEn: [
      "QR EGY reserves the right to modify or update these terms at any time.",
      "Continued use of the system after updates constitutes acceptance of the new terms.",
    ],
  },
];

export const TermsPage = () => {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen py-16 px-6 md:px-20 lg:px-40 text-gray-100"
      style={{
        background: "linear-gradient(to bottom right, #600eb8b6, #2168e3a5)",
      }}
    >
      <h1 className="text-3xl font-extrabold mb-12 text-center text-white drop-shadow-md">
        {lang === "ar" ? "شروط الاستخدام" : "Terms of Service"}
      </h1>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="bg-[#0d1b2a] rounded-xl p-6 cursor-pointer relative overflow-hidden shadow-lg border border-[#3ae1ff33]"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ae1ff44] to-[#600eb844] opacity-10 blur-lg rounded-xl"></div>

            <div
              onClick={() => toggleSection(idx)}
              className="relative flex justify-between items-center z-10"
            >
              <h2 className="text-lg font-bold text-[#3ae1ff]">
                {lang === "ar" ? section.titleAr : section.titleEn}
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-gray-300 transition-transform ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </div>

            {openIndex === idx && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 list-disc list-inside text-gray-300 space-y-2 z-10 relative"
              >
                {(lang === "ar" ? section.contentAr : section.contentEn).map(
                  (line, i) => (
                    <li key={i}>{line}</li>
                  )
                )}
              </motion.ul>
            )}
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-center text-gray-200 text-sm opacity-80">
        {lang === "ar"
          ? "للاستفسارات، تواصل معنا عبر info@qregy.com"
          : "For inquiries, contact us at info@qregy.com"}
      </p>
    </div>
  );
};
