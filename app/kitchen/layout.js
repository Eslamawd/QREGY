// 💡 1. إضافة Metadata Export (تبقى هنا لأن هذا الملف الآن Server Component)
export const metadata = {
  applicationName: "QREGY",
  title: "QREGY Kitchen Dashboard", // يمكنك إضافة عنوان للصفحة
  themeColor: "#facc15",
  manifest: "/kitchen-manifest.json",
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

export default function KitchenLayout({ children }) {
  // 💡 2. لا حاجة لتعديل الـ JSX
  return <main className="md:col-span-4">{children}</main>;
}
