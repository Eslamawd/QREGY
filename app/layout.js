import "./globals.css";
import Providers from "@/components/layout/Providers";
import { Poppins, Tajawal } from "next/font/google";
import Script from "next/script";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  applicationName: "QREGY",
  title: "QR EGY | نظام القوائم الذكية للمطاعم",
  description:
    "حوّل مطعمك إلى تجربة رقمية حديثة مع QR EGY. نظام قوائم ذكية، طلبات فورية، تقارير تحليلية، وشاشة مطبخ تفاعلية.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QR EGY | نظام القوائم الذكية للمطاعم",
  },
  icons: {
    icon: "/qregylogo_192x192.png",
    apple: "/qregylogo_192x192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl">
      <body className={`${poppins.variable} ${tajawal.variable} antialiased`}>
        {/* ✅ تحميل pwa.js بشكل صحيح */}
        <Script src="/pwa.js" strategy="afterInteractive" />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
