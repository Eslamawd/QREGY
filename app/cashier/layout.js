// app/kitchen/[id]/layout.js

// تحديد الميتا داتا اللازمة لـ PWA وإعدادات العرض
export const metadata = {
  applicationName: "QREGY",
  title: "QREGY | كاشير",
  description: "لوحة تحكم الكاشير الذكية لاستقبال طلبات الدفع.",
  themeColor: "#facc15", // لون الثيم
  // 💡 الأهم: إضافة رابط ملف Manifest
  manifest: "/cashier-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QR EGY | نظام القوائم الذكية للمطاعم",
    // startUpImage: [],
  },
  icons: {
    icon: "/qregylogo_192x192.png", // الأيقونات العادية (للويب والمانيفيست)
    apple: "/qregylogo_192x192.png", // 💡 الأيقونة الخاصة بـ iOS
  },
};

export default function CashierLayout({ children }) {
  // هنا يمكن إضافة شريط تنقل علوي أو تذييل ثابت، لكن نكتفي بـ children
  return <div className="min-h-screen bg-gray-900">{children}</div>;
}
