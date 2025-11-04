// app/kitchen/[id]/layout.js (تم التعديل)

// ❌ إزالة "use client";

// 💡 1. إضافة Metadata Export (تبقى هنا لأن هذا الملف الآن Server Component)
export const metadata = {
  title: "QREGY Kitchen Dashboard", // يمكنك إضافة عنوان للصفحة
  themeColor: "#facc15",
  manifest: "/cashier-manifest.json",
};

export default function CashierLayout({ children }) {
  // 💡 2. لا حاجة لتعديل الـ JSX
  return <main className="md:col-span-4">{children}</main>;
}
