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
  const { lang, t } = useLanguage();

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
                  {t("brand.name")}
                </div>
              </Link>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t("footer.description")}
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
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.restaurantRegistration")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.manageOrders")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.instantReports")}
                </a>
              </li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("footer.forRestaurants")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.cashierManagement")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.kitchenDisplay")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.accountManagement")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.customerManagement")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("footer.contactUs")}
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
                  {t("footer.location")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
