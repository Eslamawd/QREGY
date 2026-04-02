"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeToggle({ compact = false }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = activeTheme !== "light";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <span
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:border-slate-500 hover:bg-white dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:border-white/50 dark:hover:bg-white/20"
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
    >
      {mounted && isDark ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!compact && <span>{isDark ? t("theme.light") : t("theme.dark")}</span>}
    </span>
  );
}
