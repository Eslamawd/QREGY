"use client";
import { Toaster } from "@/components/ui/Toster";
import { Toaster as Sonner } from "@/components/ui/Sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { usePathname } from "next/navigation";
import InstallPrompt from "../InstallPrompt";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  const pathname = usePathname();

  // الصفحات اللي مش عايز فيها Header و Footer
  const hideLayoutRoutes = ["/menu", "/kitchen", "/cashier"];
  const shouldHideLayout = hideLayoutRoutes.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <CurrencyProvider>
            {/* Toasts */}
            <Toaster />
            <Sonner />

            {/* Header & Footer حسب المسار */}
            {!shouldHideLayout && <Header />}

            {children}
            <InstallPrompt />

            {!shouldHideLayout && <Footer />}
          </CurrencyProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
