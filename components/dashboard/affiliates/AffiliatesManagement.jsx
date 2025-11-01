"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

import { Loader2, SubtitlesIcon, DollarSign, X } from "lucide-react";

import { toast } from "sonner";
import Pagination from "@/components/layout/Pagination";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getAffiliates } from "@/lib/affiliatesApi";
import { Button } from "@/components/ui/button";

const AffiliatesManagement = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [totalRegistr, setTotalRegistr] = useState(0);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [showEarning, setShowEarning] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { lang } = useLanguage();

  const { formatPrice } = useCurrency();

  // Function to fetch affiliates data
  const fetchAffiliates = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const res = await getAffiliates(currentPage);

      // ✅ هنا التعديل الأساسي
      const firstAffiliate = res.affiliate.data[0];

      setAffiliates(firstAffiliate);
      setEarnings(firstAffiliate?.earnings || []);
      setTotalRegistr(firstAffiliate?.registrations || 0);
      setRevenue(firstAffiliate?.balance || 0);
      setCurrentPage(res.affiliate.current_page);
      setLastPage(res.affiliate.last_page);
      setTotal(res.affiliate.total);
    } catch (error) {
      console.error("Failed to load affiliates:", error);
      toast.error("Failed to load affiliates.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      className=" text-gray-200"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {lang === "ar" ? "إدارة الشركاء" : "Affiliates Management"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <SubtitlesIcon className="h-4 w-4 text-muted-foreground" />
              {lang === "ar" ? "رمز الشركاء" : "Code Affiliates"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <motion.div
                className="text-2xl font-bold"
                key={affiliates.affiliate_code}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {affiliates.affiliate_code}
              </motion.div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <SubtitlesIcon className="h-4 w-4 text-muted-foreground" />
              {lang === "ar" ? "  إجمالي الشركاء " : "Total Affiliates"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <motion.div
                className="text-2xl font-bold"
                key={totalRegistr}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {totalRegistr}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {lang === "ar" ? "ربح" : "Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded">
                <Loader2 className="w12 h-12" />
              </div>
            ) : (
              <motion.div
                className="text-2xl font-bold"
                key={revenue}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(revenue)}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {earnings?.length === 0 ? (
        <p className="text-center mt-4">
          {lang === "ar" ? "لا توجد أرباح بعد" : "You have no earnings yet."}
        </p>
      ) : (
        <>
          {/* ✅ Table is now scrollable on mobile */}
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ar" ? "المعرف" : "ID"}</TableHead>
                  <TableHead>
                    {lang === "ar" ? "البريد & الهاتف" : "Mail & Phone"}
                  </TableHead>
                  <TableHead>{lang === "ar" ? "من" : "From"}</TableHead>
                  <TableHead>{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                  <TableHead>{lang === "ar" ? "المبلغ" : "Amount"}</TableHead>
                  <TableHead>
                    {lang === "ar" ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((earn) => (
                  <React.Fragment key={earn.id}>
                    <TableRow>
                      <TableCell>{earn.id}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {earn.user.email} / {earn.user.phone}
                      </TableCell>
                      <TableCell>
                        {new Date(earn.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            earn.status === "pending"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {earn.status}
                        </span>
                      </TableCell>
                      <TableCell
                        className={
                          earn.status === "pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        + {formatPrice(earn.amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEarning(earn)}
                        >
                          {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            label={lang === "ar" ? "الشركاء" : "Affiliates"}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          />
        </>
      )}
      <ShowSubscriptions
        selectedEarn={selectedEarning}
        setSelectedEarn={setSelectedEarning}
        lang={lang}
        formatPrice={formatPrice}
      />
    </motion.div>
  );
};

export default AffiliatesManagement;

const ShowSubscriptions = ({
  selectedEarn,
  setSelectedEarn,
  lang,
  formatPrice,
}) => {
  if (!selectedEarn) return null;

  const subscriptions = selectedEarn?.user?.subscripe || [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedEarn(null)}
      />

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className=" rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
          {/* زر إغلاق */}
          <button
            onClick={() => setSelectedEarn(null)}
            className="absolute top-4 right-4 hover:bg-gray-200 rounded-full p-2"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-4">
            {lang === "ar" ? "تفاصيل الاشتراكات" : "Subscriptions Details"}
          </h2>

          {subscriptions.length === 0 ? (
            <p>
              {lang === "ar"
                ? "لا يوجد اشتراكات"
                : "No subscriptions available"}
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">{lang === "ar" ? "الخطة" : "Plan"}</th>
                    <th className="p-2">{lang === "ar" ? "السعر" : "Price"}</th>
                    <th className="p-2">
                      {lang === "ar" ? "العمولة (15%)" : "Commission (15%)"}
                    </th>

                    <th className="p-2">{lang === "ar" ? "الشهر" : "Month"}</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub, index) => {
                    const commission = parseFloat(sub.price) * 0.15;
                    return (
                      <tr key={index} className="border-t">
                        <td className="p-2 capitalize">{sub.plan}</td>
                        <td className="p-2">{formatPrice(sub.price)}</td>
                        <td className="p-2 font-semibold text-green-600">
                          + {formatPrice(commission.toFixed(2))}
                        </td>

                        <td className="p-2">
                          {new Date(sub.end_date).getMonth() + 1}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
