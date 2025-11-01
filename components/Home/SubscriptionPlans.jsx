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
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl shadow-xl border border-gray-800 p-6 flex flex-col justify-between transition ${
        isSelected
          ? "bg-gradient-to-r from-purple-700 to-purple-500"
          : "bg-gray-900 hover:border-purple-600"
      }`}
    >
      {/* ✅ شارة VIP */}
      {hasVip && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
          VIP
        </div>
      )}

      {/* ✅ العنوان */}
      <h3 className="text-2xl font-bold mb-3 text-white text-center">
        {lang === "ar" ? plan.name : plan.name_en}
      </h3>

      {/* ✅ السعر */}
      <div className="text-center mb-4">
        <p className="text-4xl font-extrabold text-white">
          {formatPrice(Number(plan.price))}
        </p>
        <p className="text-sm line-through text-gray-400">
          {formatPrice(Number(oldPrice))}
        </p>
        <p className="text-sm mt-1 text-gray-300">
          {Math.floor(plan.duration_days / 30)}{" "}
          {lang === "ar" ? "شهر" : "Month"}
        </p>
      </div>

      {/* ✅ التفاصيل الأساسية */}
      <ul className="text-gray-200 text-sm space-y-1 mb-4">
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
        <div className="bg-gray-800/50 p-3 rounded-lg mb-4 text-gray-100 text-sm">
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
        className="w-full py-3 mt-auto font-bold rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white"
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
          lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please log in first"
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
            : res.message
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
      <div className=" min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        <h2 className="text-3xl md:text-5xl font-extrabold  mb-8 text-center">
          {lang === "ar" ? "اختر خطة الاشتراك " : "Choose Your Subscription"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
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
        <AlertDialogContent className="sm:max-w-md p-8 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-white/10 shadow-2xl backdrop-blur-md text-white rounded-2xl">
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
