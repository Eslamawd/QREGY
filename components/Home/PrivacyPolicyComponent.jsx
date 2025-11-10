"use client";
import React from "react";
import { motion } from "framer-motion";
import { Info, Shield, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Separator } from "../ui/Separator";
import { useLanguage } from "@/context/LanguageContext";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PrivacyPolicyComponent = () => {
  const { lang } = useLanguage();

  const arText = {
    title: "سياسة الخصوصية",
    lastUpdated: "تاريخ آخر تحديث: 10 نوفمبر 2024",
    intro:
      "نحن في QREGY نولي أهمية قصوى لخصوصيتك. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لمنصتنا المخصصة لإدارة المطاعم.",
    section1: "1. المعلومات التي نجمعها",
    s1_p1:
      "نجمع نوعين رئيسيين من المعلومات: المعلومات التي تقدمها لنا والمعلومات التي نجمعها تلقائيًا.",
    s1_item1:
      "بيانات الحساب الشخصي (عند التسجيل): الاسم الكامل، البريد الإلكتروني، ورقم الهاتف.",
    s1_item2:
      "بيانات المطعم/الفرع: اسم المطعم، اسم الفرع، العملة، وموقع المطعم (اختياري).",
    s1_item3:
      "بيانات الدفع: يتم التعامل مع جميع معلومات الدفع بواسطة مزود خدمة دفع آمن (مثل Stripe)، ولا نقوم بتخزين تفاصيل بطاقتك الائتمانية.",
    section2: "2. كيف نستخدم معلوماتك",
    s2_p1: "نستخدم البيانات التي نجمعها للأغراض التالية:",
    s2_item1: "تقديم وإدارة وصيانة منصة الإدارة الخاصة بك.",
    s2_item2: "التواصل معك بخصوص التحديثات والخدمات والدعم الفني.",
    s2_item3:
      "تحليل الاستخدام لتحسين تجربة المستخدم وأداء النظام (مثل التحليل الذي نقوم به في هذه المحادثة).",
    section3: "3. حماية البيانات",
    s3_p1:
      "نحن نستخدم إجراءات أمنية معيارية لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو التدمير. يتم تشفير البيانات الحساسة (مثل كلمات المرور) قبل تخزينها.",
    section4: "4. حقوقك",
    s4_p1: "لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:",
    s4_item1: "الحق في الوصول إلى البيانات الخاصة بك وتصحيحها.",
    s4_item2:
      "الحق في طلب حذف حسابك وبياناتك (بما يتماشى مع المتطلبات القانونية).",
    section5: "5. تحديثات السياسة",
    s5_p1:
      "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عن طريق البريد الإلكتروني أو إشعار واضح على المنصة.",
  };

  const enText = {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: November 10, 2024",
    intro:
      "At QREGY, your privacy is of paramount importance. This policy explains how we collect, use, and protect your personal information when you use our restaurant management platform.",
    section1: "1. Information We Collect",
    s1_p1:
      "We collect two main types of information: information you provide to us, and information we collect automatically.",
    s1_item1:
      "Personal Account Data (during registration): Full name, email address, and phone number.",
    s1_item2:
      "Restaurant/Branch Data: Restaurant name, branch name, currency, and restaurant location (optional).",
    s1_item3:
      "Payment Data: All payment information is handled by a secure payment gateway provider (e.g., Stripe), and we do not store your credit card details.",
    section2: "2. How We Use Your Information",
    s2_p1: "We use the data we collect for the following purposes:",
    s2_item1: "To provide, manage, and maintain your management platform.",
    s2_item2:
      "To communicate with you regarding updates, services, and technical support.",
    s2_item3:
      "To analyze usage to improve user experience and system performance (such as the analysis we are doing in this conversation).",
    section3: "3. Data Security",
    s3_p1:
      "We use industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Sensitive data (like passwords) are encrypted before storage.",
    section4: "4. Your Rights",
    s4_p1: "You have the following rights regarding your personal data:",
    s4_item1: "The right to access and correct your data.",
    s4_item2:
      "The right to request the deletion of your account and data (in line with legal requirements).",
    section5: "5. Policy Updates",
    s5_p1:
      "We may update this Privacy Policy from time to time. We will notify you of any material changes via email or a prominent notice on the platform.",
  };

  const text = lang === "ar" ? arText : enText;

  return (
    <motion.div
      className="rounded-lg mt-6 shadow-md flex justify-center items-center py-6 pt-14 px-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
      variants={sectionVariants}
      initial="hidden"
      animate="show"
    >
           {" "}
      <Card className="w-full max-w-3xl">
               {" "}
        <CardHeader className="space-y-1">
                   {" "}
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="h-7 w-7 text-primary" />           {" "}
            {text.title}         {" "}
          </CardTitle>
                   {" "}
          <p className="text-sm text-muted-foreground">{text.lastUpdated}</p>
                    <Separator />       {" "}
        </CardHeader>
               {" "}
        <CardContent className="space-y-6 text-base">
                   {" "}
          <p>
            {text.intro
              .replace("[اسم شركتك]", "الشركة")
              .replace("[Your Company Name]", "The Company")}
          </p>
                    {/* Section 1: Information We Collect */}         {" "}
          <div>
                       {" "}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Info className="h-5 w-5 text-indigo-500" />{" "}
              {text.section1}           {" "}
            </h2>
                        <p className="mb-3">{text.s1_p1}</p>           {" "}
            <ul className="list-disc pl-5 space-y-1">
                            <li>{text.s1_item1}</li>             {" "}
              <li>{text.s1_item2}</li>              <li>{text.s1_item3}</li>   
                     {" "}
            </ul>
                     {" "}
          </div>
                    {/* Section 2: How We Use Your Information */}         {" "}
          <div>
                       {" "}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <CheckCheck className="h-5 w-5 text-green-500" />{" "}
              {text.section2}           {" "}
            </h2>
                        <p className="mb-3">{text.s2_p1}</p>           {" "}
            <ul className="list-disc pl-5 space-y-1">
                            <li>{text.s2_item1}</li>             {" "}
              <li>{text.s2_item2}</li>              <li>{text.s2_item3}</li>   
                     {" "}
            </ul>
                     {" "}
          </div>
                              {/* Section 3: Data Security */}         {" "}
          <div>
                       {" "}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-yellow-500" />{" "}
              {text.section3}           {" "}
            </h2>
                        <p>{text.s3_p1}</p>         {" "}
          </div>
                              {/* Section 4: Your Rights */}         {" "}
          <div>
                       {" "}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Info className="h-5 w-5 text-red-500" />{" "}
              {text.section4}           {" "}
            </h2>
                        <p className="mb-3">{text.s4_p1}</p>           {" "}
            <ul className="list-disc pl-5 space-y-1">
                            <li>{text.s4_item1}</li>             {" "}
              <li>{text.s4_item2}</li>           {" "}
            </ul>
                     {" "}
          </div>
                              {/* Section 5: Policy Updates */}         {" "}
          <div>
                       {" "}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <CheckCheck className="h-5 w-5 text-blue-500" />{" "}
              {text.section5}           {" "}
            </h2>
                        <p>{text.s5_p1}</p>         {" "}
          </div>
                   {" "}
          <p className="text-sm pt-4 text-center text-muted-foreground">
                       {" "}
            {lang === "ar"
              ? "لأية أسئلة، يرجى التواصل معنا عبر"
              : "For any questions, please contact us at"}{" "}
            support@qregy.com          {" "}
          </p>
                 {" "}
        </CardContent>
             {" "}
      </Card>
         {" "}
    </motion.div>
  );
};

export default PrivacyPolicyComponent;
