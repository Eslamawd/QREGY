"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  CreditCard,
  Contact,
  Plane,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { lang } = useLanguage();
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (user.role !== "admin") {
      router.push("/");
    } else if (!user.verified) {
      router.push("/send-verified");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("فشل تسجيل الخروج:", err);
    }
  };

  if (!user) return null;

  const menuItems = [
    {
      icon: BarChart3,
      href: "/admin",
      labelAr: "لوحة المعلومات",
      labelEn: "Dashboard",
    },
    {
      icon: Users,
      href: "/admin/customers",
      labelAr: "العملاء",
      labelEn: "Customers",
    },
    {
      icon: Building2,
      href: "/admin/subscriptions",
      labelAr: "الاشتراكات",
      labelEn: "Subscriptions",
    },
    {
      icon: Plane,
      href: "/admin/plan-sub",
      labelAr: "خطط الاشتراكات",
      labelEn: "Plans",
    },
    {
      icon: CreditCard,
      href: "/admin/payments",
      labelAr: "المدفوعات",
      labelEn: "Payments",
    },
    {
      icon: Contact,
      href: "/admin/contacts",
      labelAr: "الاتصالات",
      labelEn: "Contacts",
    },
    {
      icon: CreditCard,
      href: "/admin/withdraw",
      labelAr: "السحوبات",
      labelEn: "Withdrawals",
    },
  ];

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mt-16 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
        </h1>
        <Button onClick={handleLogout} variant="destructive">
          <LogOut />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              {menuItems.map(({ icon: Icon, href, labelAr, labelEn }) => {
                const active = pathname === href;
                return (
                  <Link className="m-1 block" key={href} href={href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      className={`flex items-center gap-2 w-full justify-start text-gray-700 hover:bg-primary/10 hover:text-primary ${
                        active ? "bg-primary text-white" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {lang === "ar" ? labelAr : labelEn}
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <main className="md:col-span-4">{children}</main>
      </div>
    </motion.div>
  );
}
