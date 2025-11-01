"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendVerificationEmail } from "@/lib/email";

export default function SendVerifiedPage() {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await sendVerificationEmail();
      if (response.error) {
        console.error(response);
        toast.error(response.error || response.message);
        setLoading(false);
        return;
      }
      console.log(response);
      toast.success(
        response.message || "تم إرسال رابط التحقق إلى بريدك الإلكتروني"
      );
    } catch (err) {
      console.error(err);
      toast.error("فشل في إرسال بريد التحقق.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4">تأكيد البريد الإلكتروني مطلوب</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        بريدك الإلكتروني لم يتم تأكيده بعد. من فضلك تحقق من بريدك الوارد واضغط
        على رابط التفعيل. إذا لم يصلك البريد، يمكنك إعادة الإرسال من هنا.
      </p>
      <Button
        onClick={handleResend}
        className="custom-button"
        disabled={loading}
      >
        {loading ? "جاري الإرسال..." : "إعادة إرسال رابط التحقق"}
      </Button>
    </div>
  );
}
