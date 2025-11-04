// kitchen/layout.js

"use client";

// 💡 1. إضافة Metadata Export
// سيتم دمج هذا الكائن في <head>
export const metadata = {
  // هذا يحدد لون شريط الحالة في PWA
  themeColor: "#facc15",
  // هذا يحدد ملف البيان
  manifest: "/kitchen-manifest.json",
};

export default function KitchenLayout({ children }) {
  // 💡 2. لا حاجة لتعديل الـ JSX هنا، لأنه بالفعل سيتضمن Metadata
  return <main className="md:col-span-4">{children}</main>;
}
