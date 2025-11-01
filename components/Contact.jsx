"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { sendContect } from "@/lib/email";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const Contact = () => {
  const { lang } = useLanguage();

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    countryCode: "+966",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(
        lang === "ar"
          ? "الرجاء ملء جميع الحقول"
          : "Please fill all required fields"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const form = {
        name: formData.name,
        email: formData.email,
        phone: formData.countryCode + formData.phone,
        message: formData.message,
      };
      const response = await sendContect(form);
      if (!response.message) {
        throw new Error(lang === "ar" ? "فشل الإرسال" : "Failed to send");
      }
      toast.success(response.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        countryCode: "+966",
      });
      await router.push("/");
    } catch (error) {
      toast.error(
        error.message || (lang === "ar" ? "حدث خطأ ما" : "Something went wrong")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const text = {
    ar: {
      title: "تواصل معنا",
      subtitle: "لديك أي استفسار؟ ارسل لنا رسالة وسنرد عليك في أقرب وقت.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال",
      phone: "رقم الهاتف",
    },
    en: {
      title: "Contact Us",
      subtitle:
        "Have any questions? Send us a message and we'll get back to you shortly.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      phone: "Phone Number",
    },
  };
  const t = text[lang];

  return (
    <section className=" text-gray-200 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
          <p className="mt-3 text-white/70">{t.subtitle}</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-4">
            <Label>{t.name}</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.name}
              required
              className="p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label>{t.email}</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t.email}
              required
              className="p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>{t.phone}</Label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className=" text-white rounded-md border  p-2"
              >
                <option className="bg-indigo-900" value="+20">
                  🇪🇬 +20
                </option>
                <option className="bg-indigo-900" value="+966">
                  🇸🇦 +966
                </option>
                <option className="bg-indigo-900" value="+971">
                  🇦🇪 +971
                </option>
                <option className="bg-indigo-900" value="+1">
                  🇺🇸 +1
                </option>
              </select>
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="123456789"
                className="flex-1 p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:col-span-2">
            <Label>{t.message}</Label>
            <Textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t.message}
              className="p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                t.send
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};
