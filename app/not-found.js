"use client";
import React from "react";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <motion.div
      dir="rtl" // اتجاه عربي
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.9 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col items-center justify-center text-center mt-16 py-12 md:py-20"
    >
      <h1 className="text-9xl font-bold  text-red-700">404</h1>
      <h2 className="text-3xl font-bold text-white mt-6">الصفحة غير موجودة</h2>
      <p className="text-gray-200 dark:text-gray-300 mt-4 max-w-md">
        الصفحة التي تبحث عنها قد تكون حُذفت، أو تم تغيير عنوانها، أو أنها غير
        متاحة مؤقتًا.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/">
          <Button size="lg">
            <Home className="ml-2 h-5 w-5" />
            الرجوع للرئيسية
          </Button>
        </Link>
        <Link href="/jobs">
          <Button variant="outline" size="lg">
            <Search className="ml-2 h-5 w-5" />
            تصفح الوظائف
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
