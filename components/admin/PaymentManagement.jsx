"use client";
import React, { useState, useEffect, use } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { toast } from "sonner";
import {
  Search,
  Mail,
  AlertTriangle,
  Wallet,
  Plus,
  Image,
  Pyramid,
} from "lucide-react";

import { changeStatus, loadAllPayments } from "@/lib/walletApi";
import Pagination from "../layout/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { depositBalance } from "@/lib/walletApi";
import { Label } from "../ui/Label";
import { useLanguage } from "@/context/LanguageContext";

import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);

  const { lang } = useLanguage();

  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [balanceAction, setBalanceAction] = useState("deposit");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [paymentToImage, setPaymentToImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { formatPrice } = useCurrency();

  const fetchPayments = async () => {
    try {
      const response = await loadAllPayments(currentPage);
      setPayments(response?.payments.data || []);
      setFilteredPayments(response?.payments.data || []);
      setCurrentPage(response.payments.current_page);
      setLastPage(response.payments.last_page);
      setTotal(response.payments.total);
      if (response.payments.length === 0) {
        toast.info("لا يوجد مستخدمين");
      }
    } catch (error) {
      console.error("فشل في جلب المستخدمين", error);
    }
  };
  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  // البحث
  useEffect(() => {
    if (searchQuery) {
      setFilteredPayments(
        payments.filter(
          (payment) =>
            payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPayments(payments);
    }
  }, [searchQuery, payments]);

  // تغيير دور المستخدم
  const togglePaymentStatus = async (paymentId, status) => {
    try {
      const response = await changeStatus(paymentId, { status: status });

      fetchPayments(currentPage);
      toast.success(`تم تغيير  إلى ${status}`);
    } catch (error) {
      console.error("فشل تغيير ", error);
      toast.error("فشل تغيير ");
    }
  };

  const handleBalanceUpdate = async () => {
    if (!selectedPayment) return;

    if (balanceAmount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (
      balanceAction === "withdraw" &&
      balanceAmount > selectedPayment.balance
    ) {
      toast.error("Cannot remove more than the current balance");
      return;
    }

    try {
      const response = await depositBalance(
        selectedPayment.id,
        { amount: balanceAmount },
        balanceAction
      );

      fetchPayments(currentPage);
      setShowBalanceDialog(false);
      toast.success(
        balanceAction === "deposit"
          ? lang === "ar"
            ? "تم إيداع الرصيد بنجاح"
            : "Balance deposited successfully"
          : null
      );
    } catch (error) {
      console.error("Failed to update balance", error);
      toast.error("Failed to update balance");
    }
  };

  // Open Balance Dialog
  const openBalanceDialog = (payment, action) => {
    setSelectedPayment(payment);
    setBalanceAction(action);
    setBalanceAmount(0);
    setShowBalanceDialog(true);
  };

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className=" text-gray-200"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            {lang === "ar" ? "إدارة المدفوعات" : "Payment Management"}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                lang === "ar"
                  ? "ابحث عن المدفوعات بالبريد أو الاسم"
                  : "Search payment by email or name"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>

        <CardContent>
          {filteredPayments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">
                {lang === "ar" ? "لا يوجد مدفوعات" : "No payments found"}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? lang === "ar"
                    ? "حاول تعديل نص البحث"
                    : "Try adjusting your search"
                  : lang === "ar"
                  ? "لم يتم تسجيل أي مستخدم بعد"
                  : "No payments have been registered yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {lang === "ar"
                        ? "المستخدم & البريد الإلكتروني"
                        : "Payment & Email"}
                    </TableHead>
                    <TableHead>{lang === "ar" ? "الهاتف" : "Phone"}</TableHead>
                    <TableHead>
                      {lang === "ar" ? "الرصيد" : "Balance"}
                    </TableHead>
                    <TableHead>{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-right">
                      {lang === "ar" ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium flex items-center gap-1">
                        <Pyramid className="h-4 w-4 text-muted-foreground" />
                        {payment.user.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {payment.user.email}
                      </TableCell>
                      <TableCell>{payment.user?.phone}</TableCell>

                      <TableCell className="flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatPrice(payment.amount) || 0.0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : payment.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-200 text-black dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {payment.status === "approved"
                            ? lang === "ar"
                              ? "مقبول"
                              : "Approved"
                            : payment.status === "rejected"
                            ? lang === "ar"
                              ? "مرفوض"
                              : "Rejected"
                            : payment.status === "pending"
                            ? lang === "ar"
                              ? "قيد الانتظار"
                              : "Pending"
                            : null}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button
                            onClick={() =>
                              openBalanceDialog(payment, "deposit")
                            }
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {lang === "ar" ? "إيداع" : "Deposit"}
                          </Button>

                          <Select
                            defaultValue={payment.status}
                            onValueChange={(val) =>
                              togglePaymentStatus(payment.id, val)
                            }
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black">
                              <SelectItem value="pending">
                                {lang === "ar" ? "معلق" : "Pending"}
                              </SelectItem>
                              <SelectItem value="rejected">
                                {lang === "ar" ? "مرفوض" : "Rejected"}
                              </SelectItem>
                              <SelectItem value="approved">
                                {lang === "ar" ? "مقبول" : "Approved"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => {
                              setShowImageDialog(true);
                              setPaymentToImage(payment);
                            }}
                          >
                            <Image className="h-4 w-4 mr-1" />
                            {lang === "ar" ? "عرض" : "Show"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          label={lang === "ar" ? "المدفوعات" : "Payments"}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
        />
      </Card>

      {/* نافذة إدارة الرصيد */}
      <motion.div dir={lang === "ar" ? "rtl" : "ltr"}>
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="bg-black  max-w-md">
            <DialogHeader>
              <DialogTitle>
                {lang === "ar" ? "صورة الدفع" : "Payment Image"}
              </DialogTitle>
            </DialogHeader>
            <img
              src={paymentToImage?.image}
              alt="Payment Image"
              className="w-full h-auto mb-4"
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowImageDialog(false)}
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
      {/* نافذة إدارة الرصيد */}
      <motion.div dir={lang === "ar" ? "rtl" : "ltr"}>
        <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
          <DialogContent className="bg-black  max-w-md">
            <DialogHeader>
              <DialogTitle>
                <motion.div dir={lang === "ar" ? "rtl" : "ltr"}>
                  {balanceAction === "deposit"
                    ? lang === "ar"
                      ? "إيداع"
                      : "Deposit"
                    : lang === "ar"
                    ? "سحب"
                    : "Withdraw"}
                </motion.div>
              </DialogTitle>
              <DialogDescription>
                {balanceAction === "deposit"
                  ? lang === "ar"
                    ? "إضافة أموال إلى رصيد المستخدم"
                    : "Add funds to the payment's account balance"
                  : lang === "ar"
                  ? "إزالة أموال من رصيد المستخدم"
                  : "Remove funds from the payment's account balance"}
              </DialogDescription>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{selectedPayment.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPayment.user.email}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {lang === "ar" ? "الرصيد الحالي:" : "Current Balance:"}
                  </div>
                  <div className="font-medium">
                    {formatPrice(selectedPayment.amount) || 0.0}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {lang === "ar" ? "المبلغ " : "Amount "}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={balanceAmount || ""}
                    onChange={(e) =>
                      setBalanceAmount(parseFloat(e.target.value) || 0)
                    }
                    placeholder={lang === "ar" ? "أدخل المبلغ" : "Enter amount"}
                  />

                  {balanceAction === "withdraw" &&
                    balanceAmount > selectedPayment.balance && (
                      <p className="text-sm text-red-500">
                        {lang === "ar"
                          ? `لا يمكن سحب أكثر من الرصيد الحالي (${
                              selectedPayment.balance || 0.0
                            })`
                          : `Cannot withdraw more than the current balance (${
                              selectedPayment.balance || 0.0
                            })`}
                      </p>
                    )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBalanceDialog(false)}
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleBalanceUpdate}
                disabled={
                  !balanceAmount ||
                  balanceAmount <= 0 ||
                  (balanceAction === "withdraw" &&
                    selectedPayment &&
                    balanceAmount > selectedPayment.balance)
                }
              >
                {balanceAction === "deposit"
                  ? lang === "ar"
                    ? "إضافة رصيد"
                    : "Add Funds"
                  : lang === "ar"
                  ? "سحب رصيد"
                  : "Remove Funds"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
};

export default PaymentManagement;
