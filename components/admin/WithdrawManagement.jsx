"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/layout/Pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader2, RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getWithdrawByAdmin, updateStatusWithdraw } from "@/lib/withdrawApi";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

/**
 * WithdrawHybrid.jsx
 * - Hybrid layout: Table on md+ , Cards on small screens
 * - Shows withdraw_payments + nested user / affiliate / earnings
 * - Front-end approve/reject (UI only) with toast
 */

export default function WithdrawHybrid() {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const [withdraws, setWithdraws] = useState([]); // array of withdraw objects
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getWithdrawByAdmin(p);
      const { withdraw_payments, current_page, last_page, total } = res;
      setWithdraws(withdraw_payments || []);
      setPage(current_page || p);
      setLastPage(last_page || 1);
      setTotal(total || (data.data || []).length);
    } catch (err) {
      console.error("getWithdrawByAdmin error:", err);
      toast.error(
        lang === "ar" ? "فشل في تحميل البيانات" : "Failed to load data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Front-end only: set status locally (approve/reject)
  const handleSetStatusLocal = async (id, newStatus) => {
    const payload = { status: newStatus };

    try {
      // 🕐 استدعاء فعلي للـ API (ويُفضل await)
      const res = await updateStatusWithdraw(id, payload);

      // ✅ تأكد إن الـ response فيه البيانات المطلوبة
      const withdraw = res?.withdraw_payment;
      if (!withdraw) throw new Error("Invalid response");

      // 🔄 تحديث الحالة محليًا بعد نجاح الطلب
      setWithdraws((prev) =>
        prev.map((w) =>
          w.id === withdraw.id ? { ...w, status: withdraw.status } : w
        )
      );

      // 🎉 Toast رسالة نجاح
      toast.success(
        lang === "ar"
          ? newStatus === "approved"
            ? "✅ تم اعتماد الطلب"
            : "❌ تم رفض الطلب"
          : newStatus === "approved"
          ? "✅ Request approved"
          : "❌ Request rejected"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        lang === "ar"
          ? "⚠️ خطأ في الخادم، حاول لاحقًا"
          : "⚠️ Server error, please try again"
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(page);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-semibold">
          {lang === "ar" ? "طلبات السحب" : "Withdraw Requests"}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* TABLE for md+ */}
      <div className="hidden md:block">
        {withdraws.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            {lang === "ar" ? "لا توجد طلبات سحب." : "No withdraw requests."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-blue-900 dark:bg-gray-900">
                  <TableHead className="px-4 py-2 text-left">#</TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    {lang === "ar" ? "المستخدم" : "User"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    {lang === "ar" ? "هاتف السحب" : "Phone"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-right">
                    {lang === "ar" ? "المبلغ" : "Amount"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    {lang === "ar" ? "الحالة" : "Status"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    {lang === "ar" ? "التحويل" : "Affiliate"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    {lang === "ar" ? "أرباح" : "Earnings"}
                  </TableHead>
                  <TableHead className="px-4 py-2 text-center">
                    {lang === "ar" ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {withdraws.map((w) => (
                  <TableRow key={w.id} className="hover:bg-gray-50/40">
                    <TableCell className="px-4 py-3">{w.id}</TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="font-medium">{w.user?.name || "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {w.user?.email || "—"}
                      </div>
                      <div className="text-xs text-amber-500 text-muted-foreground">
                        {formatPrice(w.user?.balance) || "—"}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      {w.phone}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-right font-semibold text-green-500">
                      {formatPrice(w.amount)}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <StatusBadge status={w.status} lang={lang} />
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {w.user?.affiliate?.affiliate_code || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ar" ? "الرصيد: " : "Balance: "}
                        {formatPrice(w.user?.affiliate?.balance || 0)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      {w.user?.affiliate?.earnings?.length > 0 ? (
                        <div className="text-sm">
                          {w.user.affiliate.earnings.map((e) => (
                            <div
                              key={e.id}
                              className="flex justify-between gap-3"
                            >
                              <span className="text-xs">
                                {new Date(e.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-xs font-medium">
                                +{formatPrice(e.amount)}
                              </span>
                              <span className="text-xs">{e.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {lang === "ar" ? "لا أرباح" : "No earnings"}
                        </span>
                      )}
                    </TableCell>

                    {w.status === "pending" && (
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleSetStatusLocal(w.id, "approved")
                            }
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              {lang === "ar" ? "اعتماد" : "Approve"}
                            </span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleSetStatusLocal(w.id, "rejected")
                            }
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-sm">
                              {lang === "ar" ? "رفض" : "Reject"}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* CARDS for small screens */}
      <div className="md:hidden space-y-4">
        {withdraws.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            {lang === "ar" ? "لا توجد طلبات سحب." : "No withdraw requests."}
          </p>
        ) : (
          withdraws.map((w) => (
            <Card key={w.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{w.id}</span>
                    <StatusBadge status={w.status} lang={lang} />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {lang === "ar" ? "المستخدم" : "User"}
                    </div>
                    <div className="font-medium">{w.user?.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.user?.email || "—"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {lang === "ar" ? "المبلغ" : "Amount"}
                    </div>
                    <div className="font-semibold text-green-500">
                      {formatPrice(w.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(w.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div>
                    {lang === "ar" ? "هاتف السحب: " : "Phone: "}
                    {w.phone}
                  </div>
                  <div>
                    {lang === "ar" ? "رمز الإحالة: " : "Affiliate: "}
                    {w.user?.affiliate?.affiliate_code || "—"}
                  </div>
                </div>

                {w.user?.affiliate?.earnings?.length > 0 && (
                  <div className="text-xs">
                    <div className="font-medium">
                      {lang === "ar" ? "الأرباح:" : "Earnings:"}
                    </div>
                    <ul className="list-disc ms-5 text-muted-foreground text-xs">
                      {w.user.affiliate.earnings.map((e) => (
                        <li key={e.id}>
                          {new Date(e.created_at).toLocaleDateString()} — +
                          {formatPrice(e.amount)} — {e.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-2 justify-end pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetStatusLocal(w.id, "approved")}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {lang === "ar" ? "اعتماد" : "Approve"}
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetStatusLocal(w.id, "rejected")}
                  >
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-sm">
                      {lang === "ar" ? "رفض" : "Reject"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pt-2">
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          total={total}
          label={lang === "ar" ? "طلبات السحب" : "Withdraws"}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, lastPage))}
        />
      </div>
    </motion.div>
  );
}

/* ---------- Helper components ---------- */

const StatusBadge = ({ status, lang }) => {
  const classes =
    status === "pending"
      ? "bg-yellow-500/20 text-yellow-500"
      : status === "approved"
      ? "bg-green-500/20 text-green-500"
      : "bg-red-500/20 text-red-500";

  const label =
    lang === "ar"
      ? status === "pending"
        ? "قيد الانتظار"
        : status === "approved"
        ? "معتمد"
        : "مرفوض"
      : status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
};
