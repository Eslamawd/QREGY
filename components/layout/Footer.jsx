import { useLanguage } from "@/context/LanguageContext";
import { Separator } from "../ui/Separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center"></div>
              <Link href={"/"} className="flex items-center gap-3">
                <div className=" font-bold animate-gradient bg-gradient-to-r from-gray-400  to-gray-900 bg-clip-text text-transparent bg-[length:200%_200%] text-4xl">
                  QR EGY
                </div>
              </Link>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "ar"
                ? "نظام القوائم الذكية للمطاعم. وفر تجربة رقمية عصرية لعملائك مع إدارة كاملة للطلبات، الكاشير، والمطبخ."
                : "Smart QR Menu system for restaurants. Deliver a modern digital experience with full control of orders, cashier, and kitchen."}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "كيف يعمل النظام" : "How it Works"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "تسجيل مطعم" : "Restaurant Registration"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "إدارة الطلبات" : "Manage Orders"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "التقارير الفورية" : "Instant Reports"}
                </a>
              </li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {lang === "ar" ? "للمطاعم" : "For Restaurants"}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "إدارة الكاشير" : "Cashier Management"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "شاشة المطبخ" : "Kitchen Display"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "إدارة الحسابات" : "Account Management"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "إدارة العملاء" : "Customer Management"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:support@qregy.com"
                  className="text-lg text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  support@qregy.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+201062679225"
                  className="text-blue-400 hover:text-blue-300 transition duration-200"
                >
                  +20 106 267 9225
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  {lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {lang === "ar"
              ? "© 2024 منصة QREGY. جميع الحقوق محفوظة."
              : "© 2024 QREGY Platform. All rights reserved."}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {lang === "ar" ? "شروط الاستخدام" : "Terms of Use"}
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {lang === "ar" ? "اتفاقية الاستخدام" : "User Agreement"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
