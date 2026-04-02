"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Loader2 } from "lucide-react";
import { loadAllData } from "@/lib/restaurantApi";

const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts"),
  {
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/7">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    ),
  },
);

export default function DashboardPage() {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const [restaurantsCount, setRestaurantsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersByRestaurant, setOrdersByRestaurant] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loadAllData();
      const {
        restaurants_count,
        orders_count,
        total_revenue,
        orders_by_restaurant,
        monthly_revenue,
        top_restaurants,
      } = res;

      setRestaurantsCount(restaurants_count);
      setOrdersCount(orders_count);
      setTotalRevenue(total_revenue);
      setOrdersByRestaurant(orders_by_restaurant);
      setMonthlyRevenue(monthly_revenue);
      setTopRestaurants(top_restaurants);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error(
        lang === "ar"
          ? "فشل في تحميل البيانات"
          : "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [lang]); // أضف lang هنا إذا كانت الدالة تعتمد عليها

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-3">
        <h2 className="bg-gradient-to-r from-slate-950 via-orange-600 to-cyan-700 bg-clip-text text-3xl font-black tracking-tight text-transparent dark:from-white dark:via-orange-300 dark:to-cyan-300">
          {lang === "ar" ? "الرؤية العامة للمنصة" : "Platform overview"}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300/82">
          {lang === "ar"
            ? "تم تخفيف الحمولة الأولى للصفحة عبر التحميل الديناميكي للرسوم، مع واجهة ألوان متوافقة مع الوضعين وإيقاع حركة أكثر وضوحًا."
            : "The first render is lighter through dynamic chart loading, with a theme-aware surface and more deliberate motion."}
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/7">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        </div>
      ) : (
        <DashboardCharts
          lang={lang}
          formatPrice={formatPrice}
          restaurantsCount={restaurantsCount}
          ordersCount={ordersCount}
          totalRevenue={totalRevenue}
          ordersByRestaurant={ordersByRestaurant}
          monthlyRevenue={monthlyRevenue}
          topRestaurants={topRestaurants}
        />
      )}
    </motion.div>
  );
}
