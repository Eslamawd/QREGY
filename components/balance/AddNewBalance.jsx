import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Copy, Check, AlertCircle, ImageUpIcon } from "lucide-react";
import { toast } from "sonner";
import {
  addBalanceBanking,
  addBalanceByUser,
  getBalanceUser,
} from "@/lib/walletApi";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

function AddNewBalance() {
  const [userBalance, setUserBalance] = useState(0);
  const [wishMoneyAccount] = useState("01062679225");
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("banking");
  const { lang } = useLanguage();

  const { formatPrice } = useCurrency();
  const [formData, setFormData] = useState({
    imageFile: null,
    imageUrl: "",
  });

  const fetchUserBalance = async () => {
    try {
      const response = await getBalanceUser();
      const safeBalance = Math.max(0, response.balance || 0);

      if (userBalance !== 0 && safeBalance !== userBalance) {
        setUserBalance(userBalance);

        if (safeBalance < 10) {
          toast.warning("Your balance is low", {
            description: "Please add funds to continue making purchases.",
          });
        }
      }

      setUserBalance(safeBalance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      toast.error("Failed to fetch balance");
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const handleImageChange = (e) => {
    // يمكنك إضافة منطق لمعالجة الصورة هنا إذا لزم الأمر
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(wishMoneyAccount).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleWishMoneySubmit = async (e) => {
    const formData = {
      amount: amount,
    };

    try {
      e.preventDefault();
      setIsProcessing(true);
      const res = await addBalanceByUser(formData);

      if (res?.url) {
        // يفتح لينك الدفع على طول
        // window.location.href = res.url; // أ
        window.open(res.url, "_self");
      } else {
        toast.error("No payment URL returned");
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment request failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWishBankingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageFile) {
      toast.error(
        `${
          lang === "ar"
            ? "يرجى تحميل صورة للدفع"
            : "Please upload an image of the payment"
        }`
      );
      return;
    }
    setIsProcessing(true);
    try {
      const payload = new FormData();
      payload.append("amount", amount);

      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }

      const res = await addBalanceBanking(payload);

      if (res?.payment?.id) {
        toast.success(
          `${
            lang === "ar"
              ? "تم إضافة الرصيد بنجاح!"
              : "Balance added successfully!"
          }`
        );
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error(
        `${
          lang === "ar"
            ? "فشل في إضافة الرصيد. يرجى المحاولة مرة أخرى."
            : "Failed to add balance. Please try again."
        }`
      );
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"} // الاتجاه
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container py-8 "
    >
      <h1 className="text-3xl font-bold mb-8">
        {lang === "ar" ? "إضافة رصيد" : "Add Funds"}
      </h1>

      <div className="max-w-xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">
                  {lang === "ar" ? "رصيدك الحالي" : "Your Current Balance"}
                </h2>
                <div className="text-3xl font-bold mt-2">
                  {formatPrice(userBalance || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {lang === "ar" ? "تفاصيل الدفع" : "Payment Details"}
            </CardTitle>
            <CardDescription>
              {lang === "ar"
                ? "اختر وسيلة الدفع لإضافة رصيد لحسابك"
                : "Select a payment method to add funds to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-2"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger
                  className="cursor-not-allowed m-2"
                  disabled
                  value="moyser"
                >
                  {lang === "ar" ? "بوابة الدفع" : "Payment gateway"}
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer m-2" value="banking">
                  {lang === "ar" ? "محفظه" : "Wallet"}
                </TabsTrigger>
              </TabsList>

              {/* Moyser Tab */}
              <TabsContent value="moyser" className="space-y-4">
                <form onSubmit={handleWishMoneySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wm-amount">
                      {lang === "ar" ? "المبلغ المرسل" : "Amount You Sent"}
                    </Label>
                    <Input
                      id="wm-amount"
                      type="text"
                      value={amount}
                      min="100"
                      onChange={handleAmountChange}
                      placeholder={
                        lang === "ar" ? "أدخل المبلغ" : "Enter amount"
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full cursor-not-allowed"
                    disabled
                  >
                    {isProcessing
                      ? lang === "ar"
                        ? "جارٍ المعالجة..."
                        : "Processing..."
                      : lang === "ar"
                      ? "تأكيد الدفع"
                      : "Confirm Payment"}
                  </Button>
                </form>
              </TabsContent>

              {/* Banking Tab */}
              <TabsContent value="banking" className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-md mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {lang === "ar"
                          ? " هذا هو الرقم الخاص بالتحويلات علي المحفظه تأكد من نسخ الرقم وارسال المبلغ ووضع الملغ اسفل وارسال صورة التحويل لقبول العمليه"
                          : "This is the number for transfers to the wallet. Make sure to copy the number, send the amount, put the amount below, and send a picture of the transfer to accept the process."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className=" justify-between cursor-pointer "
                      onClick={handleCopyAccount}
                    >
                      <span className="flex justify-between items-center">
                        {copied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied
                          ? lang === "ar"
                            ? "تم النسخ"
                            : "Copied"
                          : lang === "ar"
                          ? "نسخ"
                          : "Copy"}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-6 p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 rounded-md">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {lang === "ar" ? "هام:" : "Important:"}
                    </p>
                    <p>
                      {lang === "ar"
                        ? "قم بتحميل الصورة المسجلة في ملاحظات الدفع حتى نستطيع التحقق من الدفع."
                        : "Upload your image in the payment notes so we can identify your payment."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWishBankingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wm-amount">
                      {lang === "ar" ? "المبلغ المرسل" : "Amount You Sent"}
                    </Label>
                    <Input
                      id="wm-amount"
                      type="text"
                      value={amount}
                      min="100"
                      onChange={handleAmountChange}
                      placeholder={
                        lang === "ar" ? "أدخل المبلغ" : "Enter amount"
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2 w-full justify-center">
                    <Label htmlFor="image">
                      <ImageUpIcon className="mr-2 inline-block h-8 w-8 text-green-400" />
                      {lang === "ar" ? "الصورة" : "Image"}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover border rounded"
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? lang === "ar"
                        ? "جارٍ المعالجة..."
                        : "Processing..."
                      : lang === "ar"
                      ? "تأكيد الدفع"
                      : "Confirm Payment"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default AddNewBalance;
