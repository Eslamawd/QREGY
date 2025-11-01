import "./globals.css";
import Providers from "@/components/layout/Providers";
import { useLanguage } from "@/context/LanguageContext";
import { Poppins, Tajawal } from "next/font/google";

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
  title: "QR EGY | نظام القوائم الذكية للمطاعم",
  description:
    "حوّل مطعمك إلى تجربة رقمية حديثة مع QR EGY. نظام قوائم ذكية، طلبات فورية، تقارير تحليلية، وشاشة مطبخ تفاعلية.",
  keywords: [
    "QR EGY",
    "قوائم ذكية",
    "نظام مطاعم",
    "طلبات أونلاين",
    "شاشة مطبخ",
    "كاشير رقمي",
    "إدارة مطاعم",
    "تحليل مبيعات",
    "نظام QR للمطاعم",
    "مطعم ذكي",
    "منيو إلكتروني",
    "تكنولوجيا مطاعم",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
      </head>
      <body className={`${poppins.variable} ${tajawal.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
