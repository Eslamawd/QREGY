"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";
import { Loader2 } from "lucide-react";
import { getsubscribeByUser } from "@/lib/subscriptionApi";
import { toast } from "sonner";
import Pagination from "../../layout/Pagination";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

const SubscriptionsShow = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await getsubscribeByUser(currentPage);
      setSubscriptions(res.subscriptions.data);
      setCurrentPage(res.subscriptions.current_page);
      setLastPage(res.subscriptions.last_page);
      setTotal(res.subscriptions.total);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      toast.error(
        lang === "ar"
          ? "حدث خطأ أثناء تحميل الاشتراكات"
          : "Failed to load subscriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4 text-gray-50 dark:text-gray-200"
    >
      {/* العنوان */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">
          {lang === "ar" ? "إدارة الاشتراكات" : "Subscriptions Management"}
        </h2>
      </div>

      {/* الجدول داخل حاوية متجاوبة */}
      {subscriptions.length === 0 ? (
        <p className="text-center py-10 text-gray-50">
          {lang === "ar"
            ? "لا توجد اشتراكات بعد."
            : "You have no subscriptions yet."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Table className="min-w-[600px] w-full text-sm">
            <TableHeader>
              <TableRow className="bg-blue-950 dark:bg-gray-800">
                <TableHead className="text-right ">#</TableHead>
                <TableHead className="text-right">
                  {lang === "ar" ? "من" : "From"}
                </TableHead>
                <TableHead className="text-right">
                  {lang === "ar" ? "إلى" : "To"}
                </TableHead>
                <TableHead className="text-right">
                  {lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-right">
                  {lang === "ar" ? "السعر" : "Price"}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subscriptions.map((sub) => {
                const now = Date.now();
                const start = new Date(sub.start_date).getTime();
                const end = new Date(sub.end_date).getTime();

                let status = "Pending";
                let color = "text-yellow-600";
                if (now >= end) {
                  status = "Expired";
                  color = "text-red-600";
                } else if (now >= start) {
                  status = "Active";
                  color = "text-green-600";
                }

                return (
                  <TableRow
                    key={sub.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    <TableCell className="px-4 py-2 font-medium">
                      {sub.id}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {new Date(sub.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {new Date(sub.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className={`px-4 py-2 font-semibold ${color}`}>
                      {lang === "ar"
                        ? status === "Active"
                          ? "نشط"
                          : status === "Expired"
                          ? "منتهي"
                          : "قيد الانتظار"
                        : status}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {formatPrice(sub.price)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* الترقيم */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        total={total}
        label={lang === "ar" ? "الاشتراكات" : "Subscriptions"}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
      />
    </motion.div>
  );
};

export default SubscriptionsShow;
