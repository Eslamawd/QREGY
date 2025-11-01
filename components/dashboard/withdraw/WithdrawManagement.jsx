"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import Pagination from "@/components/layout/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useLanguage } from "@/context/LanguageContext";
import { getWithdraw, createWithdraw } from "@/lib/withdrawApi";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useCurrency } from "@/context/CurrencyContext";

// ✅ Badge Component للحالة
const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-500/20 text-yellow-500",
    approved: "bg-green-500/20 text-green-500",
    rejected: "bg-red-500/20 text-red-500",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md ${
        colors[status?.toLowerCase()] || "bg-gray-500/20 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

// ✅ Skeleton أثناء التحميل
const WithdrawSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-3 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

const WithdrawManagement = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  const fetchWithdraws = async () => {
    setLoading(true);
    try {
      const response = await getWithdraw(currentPage);
      setWithdraws(response.withdraw_payments.data || []);
    } catch (error) {
      toast.error(
        lang === "ar" ? "خطأ في تحميل البيانات" : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, [currentPage]);

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">
            {lang === "ar" ? "طلبات السحب" : "Withdraw Requests"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchWithdraws}>
              {lang === "ar" ? "تحديث" : "Refresh"}
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              {lang === "ar" ? "+ طلب سحب" : "+ New Withdraw"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <WithdrawSkeleton />
          ) : withdraws?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p>
                {lang === "ar" ? "لا يوجد سحوبات" : "No withdrawals available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {withdraws.map((withdraw) => (
                <Card key={withdraw.id} className="border shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <p>
                      <strong>
                        {lang === "ar" ? "رقم الهاتف: " : "Phone: "}
                      </strong>
                      {withdraw.phone}
                    </p>
                    <p>
                      <strong>{lang === "ar" ? "المبلغ: " : "Amount: "}</strong>
                      {formatPrice(withdraw.amount)}
                    </p>
                    <p>
                      <strong>{lang === "ar" ? "الحالة: " : "Status: "}</strong>
                      <StatusBadge status={withdraw.status} />
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "ar" ? "طلب سحب" : "Create Withdraw"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "أدخل البيانات لإنشاء طلب سحب جديد."
                : "Enter details to create a new withdraw request."}
            </DialogDescription>
          </DialogHeader>
          <CreateWithdrawForm
            onSuccess={(newData) => {
              setWithdraws((prev) => [...prev, newData]);
              setIsDialogOpen(false);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </motion.div>
  );
};

export default WithdrawManagement;

// ✅ فورم إنشاء سحب
const CreateWithdrawForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ phone: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.amount) {
      toast.error(lang === "ar" ? "أكمل كل الحقول" : "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await createWithdraw(formData);
      toast.success(
        lang === "ar" ? "تم إرسال الطلب ✅" : "Withdraw Created ✅"
      );
      onSuccess?.(res.withdraw_payment); // ✅ تم التصحيح هنا
    } catch {
      toast.error(lang === "ar" ? "حدث خطأ" : "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>{lang === "ar" ? "رقم الهاتف" : "Phone"}</Label>
        <Input name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <Label>{lang === "ar" ? "المبلغ" : "Amount"}</Label>
        <Input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2 rtl:space-x-reverse">
        <Button type="submit" disabled={loading}>
          {loading
            ? lang === "ar"
              ? "جارٍ الإرسال..."
              : "Submitting..."
            : lang === "ar"
            ? "إرسال"
            : "Submit"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {lang === "ar" ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
};
