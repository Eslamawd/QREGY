"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { useOrder } from "@/context/OrderContext";
import { useState } from "react";
import OrdersShow from "../menu/OrdersShow";
import ThemeToggle from "./ThemeToggle";

export const MenuHeader = ({
  onCartClick,
  logo,
  restaurant_id,
  user_id,
  token,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { orders, currentOrder } = useOrder();
  const [orderShow, setOrderShow] = useState(false);
  const itemCount =
    (currentOrder.items?.reduce((sum, i) => sum + i.quantity, 0) || 0) +
    orders.reduce(
      (total, order) =>
        total + (order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0),
      0,
    );
  return (
    <>
      {/* ✅ Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 left-0 right-0 z-20 border-b border-white/25 bg-white/20 shadow-[0_12px_35px_-20px_rgba(15,23,42,0.65)] backdrop-blur-2xl dark:border-white/15 dark:bg-black/20"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between py-1 px-4">
          {/* ✅ Logo */}
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt="Restaurant Logo"
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />
            ) : (
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {t("menu.restaurant")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* ✅ Language Toggle */}
            <ThemeToggle compact />

            {/* ✅ Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-white/35 bg-white/30 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 dark:border-white/25 dark:bg-white/10 dark:text-white"
            >
              <option
                className="bg-white text-slate-900 dark:bg-black dark:text-white"
                value="EGP"
              >
                EGP
              </option>
              <option
                className="bg-white text-slate-900 dark:bg-black dark:text-white"
                value="USD"
              >
                USD
              </option>
            </select>
            <span
              onClick={toggleLang}
              className="rounded-full border border-white/45 bg-white/25 px-3 py-1 text-sm text-slate-900 transition hover:bg-white/35 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              role="button"
              aria-label={
                lang === "ar"
                  ? t("language.switchToEnglish")
                  : t("language.switchToArabic")
              }
              title={lang === "ar" ? "English" : "العربية"}
            >
              {lang === "ar" ? "EN" : "AR"}
            </span>

            {/* ✅ Cart Button */}
            <div className="relative">
              <span
                onClick={() => setOrderShow(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 transition hover:scale-105 hover:bg-white/35 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
              >
                <ShoppingCart className="h-8 w-8 text-slate-900 dark:text-white" />
              </span>

              {/* Red Counter */}
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 -right-1 bg-red-600 text-white 
                             text-xs font-bold rounded-full h-5 w-5 flex items-center 
                             justify-center shadow-md"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ✅ Orders Modal */}
      <AnimatePresence>
        {orderShow && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderShow(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div
                className="rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] 
                              overflow-y-auto relative"
              >
                <button
                  onClick={() => setOrderShow(false)}
                  className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 
                             rounded-full p-2 z-50"
                >
                  <X className="w-5 h-5" />
                </button>
                <OrdersShow
                  restaurant_id={restaurant_id}
                  user_id={user_id}
                  token={token}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
