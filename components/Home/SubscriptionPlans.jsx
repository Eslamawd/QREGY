"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { loadPlanSub } from "@/lib/planSubApi";
import { useCurrency } from "@/context/CurrencyContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { renewSubscriptionAPI } from "@/lib/subscriptionApi";

const SubscriptionCard = ({ plan, isSelected, onClick, onRenew }) => {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const oldPrice = Number(plan.price) * 1.3; // مثال تخفيض 30%
  const hasVip = plan.vip_support === 1;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03, rotateX: -4, rotateY: 4, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
      className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-6 shadow-xl transition ${
        isSelected
          ? "border-cyan-300/40 bg-gradient-to-r from-cyan-700 to-blue-500"
          : "border-white/15 bg-[linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] backdrop-blur-md hover:border-cyan-400/35"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* ✅ شارة VIP */}
      {hasVip && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
          VIP
        </div>
      )}

      {/* ✅ العنوان */}
      <h3 className="text-2xl font-bold mb-3  text-center">
        {lang === "ar" ? plan.name : plan.name_en}
      </h3>

      {/* ✅ السعر */}
      <div className="text-center mb-4">
        <p className="text-4xl font-extrabold ">
          {formatPrice(Number(plan.price))}
        </p>
        <p className="text-sm line-through ">{formatPrice(Number(oldPrice))}</p>
        <p className="text-sm mt-1 ">
          {Math.floor(plan.duration_days / 30)}{" "}
          {lang === "ar" ? "شهر" : "Month"}
        </p>
      </div>

      {/* ✅ التفاصيل الأساسية */}
      <ul className=" text-sm space-y-1 mb-4">
        <li>
          🏠 {lang === "ar" ? "عدد المطاعم:" : "Restaurants:"}{" "}
          {plan.max_restaurants}
        </li>
        <li>
          🍽️ {lang === "ar" ? "عدد الطاولات:" : "Tables:"} {plan.max_tables}
        </li>
        <li>
          📦 {lang === "ar" ? "عدد المنتجات:" : "Items:"} {plan.max_items}
        </li>
        <li>
          🎧{" "}
          {lang === "ar"
            ? `دعم VIP: ${hasVip ? "نعم" : "لا"}`
            : `VIP Support: ${hasVip ? "Yes" : "No"}`}
        </li>
      </ul>

      {/* ✅ المميزات */}
      {plan.features?.length > 0 && (
        <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm  ">
          <p className="font-semibold mb-1">
            {lang === "ar" ? "المميزات:" : "Features:"}
          </p>
          <ul className="space-y-1">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span>•</span>
                <span>{lang === "ar" ? f.title_ar : f.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ زر التجديد */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRenew(plan);
        }}
        className="mt-auto w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
      >
        {lang === "ar" ? "اختر الخطة" : "Choose Plan"}
      </button>
    </motion.div>
  );
};

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(3);
  const { user } = useAuth();
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { lang } = useLanguage();

  const fetchPlanSubs = async () => {
    try {
      const response = await loadPlanSub();
      setPlans(response || []);

      if (response?.length === 0) {
        toast.info(lang === "ar" ? "لا يوجد خطط" : "No plans available");
      }
    } catch (error) {
      console.error("فشل في جلب الخطط ", error);
      toast.error("خطأ في تحميل البيانات");
    }
  };

  useEffect(() => {
    fetchPlanSubs();
  }, []);

  const handleRenewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowRenewDialog(true);
  };

  const confirmRenew = async () => {
    try {
      if (!user) {
        toast.error(
          lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please log in first",
        );
        setShowRenewDialog(false);
        return;
      }
      if (user.balance < selectedPlan.price) {
        toast.error(lang === "ar" ? "رصيدك غير كافٍ" : "Insufficient balance");
        setShowRenewDialog(false);
        return;
      }
      const res = await renewSubscriptionAPI(selectedPlan.id);

      if (res.error) {
        toast.error(
          lang === "ar"
            ? "يمكنك تجديد اشتراكك فقط خلال 7 أيام قبل انتهاء صلاحيته."
            : res.message,
        );
        return;
      }

      toast.success(lang === "ar" ? "تم التجديد بنجاح" : "Plan renewed!");
      toast.success(`${res.message}`);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setShowRenewDialog(false);
    } catch (err) {
      toast.error(lang === "ar" ? "فشل التجديد" : "Renew failed");
    }
  };

  return (
    <>
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center p-6 md:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-56 max-w-5xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_72%)]" />
        <h2 className="relative z-10 mb-3 text-center text-3xl font-extrabold md:text-5xl">
          {lang === "ar" ? "اختر خطة الاشتراك " : "Choose Your Subscription"}
        </h2>
        <p className="relative z-10 mb-8 max-w-3xl text-center text-sm  md:text-base">
          {lang === "ar"
            ? "كل خطة جاهزة للطلبات باللوكيشن من أي مكان، مع إدارة كاملة للطلبات والكاشير والمطبخ داخل نفس المنصة."
            : "Every plan is ready for location-based ordering from anywhere, with full order, cashier, and kitchen operations in one platform."}
        </p>

        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 [perspective:1400px] md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {plans.map((plan, idx) => (
              <SubscriptionCard
                key={idx}
                plan={plan}
                isSelected={selected === idx}
                onClick={() => setSelected(idx)}
                onRenew={handleRenewPlan}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <AlertDialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <AlertDialogContent className="sm:max-w-md p-8 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-white/10 shadow-2xl backdrop-blur-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === "ar" ? "تأكيد التجديد" : "Confirm Renewal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar"
                ? `هل تريد تجديد خطة ${selectedPlan?.name} ؟`
                : `Do you want to renew the ${selectedPlan?.name} plan?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRenew}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              {lang === "ar" ? "تجديد" : "Renew"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
