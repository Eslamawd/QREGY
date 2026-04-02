"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { getRestaurantWithUser } from "@/lib/restaurantApi";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  Phone,
  Flame,
  X,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MenuHeader } from "../layout/MenuHeader";
import AddToOrderButton from "./AddToOrderButton";
import { useCurrency } from "@/context/CurrencyContext";
import {
  FaGoogle,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaStar,
} from "react-icons/fa";

const AUTOPLAY_MS = 3500;

const MenuShowCategory = ({ table_id, restaurant_id, user_id, token }) => {
  const { lang } = useLanguage();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { formatPrice } = useCurrency();
  const isArabic = lang === "ar";
  const t = (ar, en) => (isArabic ? ar : en);
  const autoplayRef = useRef(null);
  const dragStartX = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(1280);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const sliderConfig = useMemo(() => {
    if (viewportWidth < 480) {
      return {
        cardW: 180,
        cardH: 230,
        depth: 150,
        sideAngle: 26,
        shiftRatio: 0.56,
        perspective: "820px",
      };
    }

    if (viewportWidth < 768) {
      return {
        cardW: 220,
        cardH: 270,
        depth: 190,
        sideAngle: 30,
        shiftRatio: 0.62,
        perspective: "980px",
      };
    }

    return {
      cardW: 280,
      cardH: 320,
      depth: 380,
      sideAngle: 50,
      shiftRatio: 0.78,
      perspective: "1200px",
    };
  }, [viewportWidth]);

  const socialLinks = [
    {
      icon: <FaGoogle className="w-10 h-10 text-red-600" />,
      field: "google_review",
    },
    {
      icon: <FaFacebook className="w-10 h-10 text-blue-500" />,
      field: "facebook",
    },
    {
      icon: <FaInstagram className="w-10 h-10 text-pink-500" />,
      field: "instagram",
    },
    { icon: <FaTiktok className="w-10 h-10" />, field: "tiktok" },
    { icon: <Globe className="w-10 h-10 text-green-400" />, field: "website" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRestaurantWithUser(restaurant_id, user_id, token);
        if (res?.active === false) {
          toast.error("⚠️ انتهى اشتراك المطعم، يرجى التجديد للاستمرار.");
          return;
        }
        setRestaurant(res);
      } catch (err) {
        console.error(err);
        toast.error(
          t("فشل تحميل بيانات المطعم", "Failed to load restaurant data"),
        );
      }
    };
    fetchData();
  }, [restaurant_id, user_id, token]);

  // ── Autoplay ──
  const startAutoplay = useCallback((total) => {
    clearInterval(autoplayRef.current);
    if (total <= 1) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
  }, []);

  const stopAutoplay = () => clearInterval(autoplayRef.current);

  useEffect(() => {
    if (!restaurant?.menus?.length) return;
    startAutoplay(restaurant.menus.length);
    return () => clearInterval(autoplayRef.current);
  }, [restaurant?.menus?.length, startAutoplay]);

  const goPrev = (total) => {
    setActiveIndex((i) => (i - 1 + total) % total);
    stopAutoplay();
  };
  const goNext = (total) => {
    setActiveIndex((i) => (i + 1) % total);
    stopAutoplay();
  };

  // circular delta
  const circleDelta = (idx, active, total) => {
    let d = idx - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  // card 3-D style (CSS only, no framer needed for the transform)
  const cardStyle = (delta) => {
    const abs = Math.abs(delta);
    const rotateY = delta * -sliderConfig.sideAngle;
    const translateZ =
      abs === 0
        ? sliderConfig.depth
        : abs === 1
          ? sliderConfig.depth * 0.55
          : abs === 2
            ? sliderConfig.depth * 0.15
            : 0;
    const translateX = delta * (sliderConfig.cardW * sliderConfig.shiftRatio);
    const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : abs === 2 ? 0.66 : 0.5;
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.55 : 0;
    const zIndex = abs === 0 ? 30 : abs === 1 ? 20 : abs === 2 ? 10 : 0;
    return { rotateY, translateZ, translateX, scale, opacity, zIndex };
  };

  if (!restaurant) return null;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen relative border border-white/10 shadow-2xl"
      style={{
        backgroundImage: `url(${restaurant.cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"> </div>
      <div className="relative z-10">
        {/* Header */}
        <MenuHeader
          logo={restaurant?.logo}
          restaurant_id={restaurant_id}
          user_id={user_id}
          token={token}
        />

        <div className="mx-auto mt-20 max-w-6xl px-4">
          <div className="overflow-hidden rounded-[32px] border border-white/15 bg-black/40 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.85)] backdrop-blur-md">
            <div className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-8">
              <div className="flex items-center justify-center">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="h-24 w-24 rounded-3xl border border-white/15 object-cover shadow-lg md:h-28 md:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-xl font-black text-white md:h-28 md:w-28">
                    {restaurant.name?.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-100">
                    {isArabic ? "مطاعم قريبة منك" : "Nearby for you"}
                  </span>
                  {restaurant.delivery_radius_km ? (
                    <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {isArabic
                        ? `نطاق الخدمة ${restaurant.delivery_radius_km} كم`
                        : `${restaurant.delivery_radius_km} km service radius`}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h1 className="text-3xl font-black text-white md:text-4xl">
                    {restaurant.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {restaurant.address}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {restaurant.phone}
                    </span>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-7 text-white/80 md:text-base">
                  {isArabic
                    ? "اختار المنيو المناسبة، راجع الأصناف والإضافات، وابدأ الطلب بسرعة من نفس الصفحة."
                    : "Choose the right menu, review items and add-ons, and place your order quickly from one polished screen."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3D Slider ── */}
        <div className="max-w-6xl mt-4 mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-center mb-2 font-cairo text-white">
            {t("القوائم المتاحة", "Available Menus")}
          </h2>

          {restaurant.menus.length === 0 ? (
            <p className="text-center text-white/60 font-cairo">
              {t("لا توجد قوائم متاحة", "No menus available")}
            </p>
          ) : (
            <>
              {/* Stage */}
              <div
                className="relative mx-auto select-none"
                style={{
                  height: sliderConfig.cardH + (viewportWidth < 768 ? 34 : 60),
                  perspective: sliderConfig.perspective,
                  perspectiveOrigin: "50% 40%",
                }}
                onMouseEnter={stopAutoplay}
                onMouseLeave={() => startAutoplay(restaurant.menus.length)}
                onTouchStart={(e) => {
                  dragStartX.current = e.touches[0].clientX;
                  stopAutoplay();
                }}
                onTouchEnd={(e) => {
                  if (dragStartX.current === null) return;
                  const diff = dragStartX.current - e.changedTouches[0].clientX;
                  if (diff > 40) goNext(restaurant.menus.length);
                  else if (diff < -40) goPrev(restaurant.menus.length);
                  dragStartX.current = null;
                }}
              >
                {/* ground shadow */}
                <div
                  className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 blur-2xl"
                  style={{
                    width:
                      sliderConfig.cardW * (viewportWidth < 768 ? 1.7 : 2.2),
                    height: viewportWidth < 768 ? 28 : 40,
                  }}
                />

                {/* Cards */}
                {restaurant.menus.map((menu, index) => {
                  const delta = circleDelta(
                    index,
                    activeIndex,
                    restaurant.menus.length,
                  );
                  const abs = Math.abs(delta);
                  if (abs > 2) return null;
                  const {
                    rotateY,
                    translateZ,
                    translateX,
                    scale,
                    opacity,
                    zIndex,
                  } = cardStyle(delta);

                  return (
                    <motion.button
                      key={menu.id}
                      type="button"
                      onClick={() => {
                        if (delta === 0) setSelectedMenu(menu);
                        else {
                          setActiveIndex(index);
                          stopAutoplay();
                        }
                      }}
                      animate={{
                        rotateY,
                        translateZ,
                        x: translateX,
                        scale,
                        opacity,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 30,
                      }}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        width: sliderConfig.cardW,
                        height: sliderConfig.cardH,
                        marginLeft: -sliderConfig.cardW / 2,
                        zIndex,
                        borderRadius: 0,
                        transformStyle: "preserve-3d",
                        cursor: delta === 0 ? "pointer" : "pointer",
                      }}
                      className="overflow-hidden rounded-none
                      border border-white/25 shadow-2xl"
                    >
                      {/* image */}
                      <img
                        src={menu.image || restaurant.logo || restaurant.cover}
                        alt={isArabic ? menu.name : menu.name_en}
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                      />

                      {/* gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* shine on active */}
                      {delta === 0 && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      )}

                      {/* content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <h3 className="text-base font-black text-white font-cairo leading-tight">
                          {isArabic ? menu.name : menu.name_en}
                        </h3>
                        <p className="mt-1 text-xs text-white/75">
                          {isArabic
                            ? `${menu.categories?.length || 0} تصنيف`
                            : `${menu.categories?.length || 0} categories`}
                        </p>
                        {delta === 0 && (
                          <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            <Plus className="h-3 w-3" />
                            {t("افتح المنيو", "Open Menu")}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goPrev(restaurant.menus.length)}
                  disabled={restaurant.menus.length <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* dots */}
                <div className="flex items-center gap-2">
                  {restaurant.menus.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveIndex(i);
                        stopAutoplay();
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "h-2.5 w-8 bg-white"
                          : "h-2.5 w-2.5 bg-white/35 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goNext(restaurant.menus.length)}
                  disabled={restaurant.menus.length <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Social & Google Review under menus */}
        <div className="overflow-hidden w-full py-4 mt-3">
          <motion.div
            className="flex gap-10"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 27,
              ease: "linear",
            }}
          >
            {[...socialLinks]
              .filter((s) => restaurant.links[s.field])
              .map((item, i) => (
                <a
                  key={i}
                  href={
                    restaurant.links[item.field].startsWith("http")
                      ? restaurant.links[item.field]
                      : "https://" + restaurant.links[item.field]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-16 h-16 hover:scale-110 transition"
                >
                  {item.icon}
                </a>
              ))}
          </motion.div>
        </div>

        <div className="flex overflow-hidden w-full mt-6 justify-center">
          {restaurant.links.google_review && (
            <GoogleReviewCard link={restaurant.links?.google_review} />
          )}
        </div>

        {/* Modal for selected menu */}
        <AnimatePresence>
          {selectedMenu && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMenu(null)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="relative h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[30px] border border-white/16 bg-[linear-gradient(165deg,rgba(255,255,255,0.95),rgba(247,250,252,0.94))] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.6)] dark:border-white/10 dark:bg-[linear-gradient(165deg,rgba(9,9,11,0.96),rgba(2,6,23,0.94))]">
                  <button
                    onClick={() => setSelectedMenu(null)}
                    className="absolute top-4 right-4 z-50 rounded-full border border-white/40 bg-white/90 p-2 text-slate-900 shadow-md transition hover:bg-white dark:border-white/12 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6">
                    <h2 className="mb-6 text-center text-2xl font-bold font-cairo text-slate-900 dark:text-white">
                      {isArabic ? selectedMenu.name : selectedMenu.name_en}
                    </h2>

                    {selectedMenu.categories.length > 0 ? (
                      selectedMenu.categories.map((cat) => (
                        <div key={cat.id} className="mb-10">
                          <h3 className="mb-4 border-b border-slate-200/80 pb-2 text-xl font-bold font-cairo text-slate-900 dark:border-white/10 dark:text-white">
                            {isArabic ? cat.name : cat.name_en}
                          </h3>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cat.items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                className="group relative overflow-hidden rounded-3xl border border-white/16 bg-[linear-gradient(170deg,rgba(255,255,255,0.95),rgba(241,245,249,0.92))] shadow-[0_25px_40px_-30px_rgba(15,23,42,0.9)] transition-all duration-300 hover:-translate-y-2 dark:border-white/10 dark:bg-[linear-gradient(170deg,rgba(13,18,32,0.9),rgba(6,9,18,0.9))]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                whileHover={{ rotateX: -2.5, rotateY: 2.5 }}
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_52%)]" />
                                <div className="relative h-48 overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute top-3 left-3 flex gap-2">
                                    {item.old_price && (
                                      <Badge className="bg-secondary text-secondary-foreground font-cairo font-semibold">
                                        {t("عرض خاص", "Special Offer")}
                                      </Badge>
                                    )}
                                    {item.isSpicy && (
                                      <Badge
                                        variant="destructive"
                                        className="font-cairo font-semibold"
                                      >
                                        <Flame className="h-3 w-3 ml-1" />{" "}
                                        {t("حار", "Spicy")}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="relative p-5 space-y-3">
                                  <h4 className="mb-1 text-lg font-bold font-cairo text-slate-900 dark:text-white">
                                    {isArabic ? item.name : item.name_en}
                                  </h4>

                                  <p className="text-sm text-muted-foreground font-cairo line-clamp-2">
                                    {isArabic
                                      ? item.description
                                      : item.description_en}
                                  </p>

                                  {/* ✅ Prices */}
                                  <div className="flex items-center gap-2 pt-2">
                                    <span className="text-xl font-bold text-orange-600 font-cairo dark:text-orange-300">
                                      {formatPrice(Number(item.price))}
                                    </span>
                                    {item.old_price && (
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(Number(item.old_price))}
                                      </span>
                                    )}
                                  </div>

                                  <AddToOrderButton
                                    table_id={table_id}
                                    setSelectedMenu={setSelectedMenu}
                                    item={item}
                                    restaurant_id={restaurant_id}
                                    lang={lang}
                                  />

                                  {/* ✅ Options */}
                                  {item.options?.length > 0 && (
                                    <div className="pt-2">
                                      <h4 className="text-sm font-cairo font-semibold mb-1">
                                        {t("الاختيارات:", "Options:")}
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {item.options.map((opt) => (
                                          <Badge
                                            key={opt.id}
                                            variant="outline"
                                            className="font-cairo text-sm"
                                          >
                                            {isArabic ? opt.name : opt.name_en}{" "}
                                            + {formatPrice(Number(opt.price))}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground font-cairo text-lg py-10">
                        {t(
                          "لا توجد تصنيفات حالياً في هذه القائمة",
                          "No categories currently in this menu",
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MenuShowCategory;

function GoogleReviewCard({ link }) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="
        w-full max-w-sm 
       
        flex flex-col  text-center  justify-center items-center cursor-pointer
         transition
      "
    >
      {/* Google Logo */}
      <div className="p-3 flex justify-center text-center  items-center rounded-full shadow-lg">
        <FaGoogle className="flex text-yellow-500 text-4xl" />
      </div>

      <div className="flex flex-col">
        <h3 className="text-white font-semibold text-lg">Google Reviews</h3>

        <div className="flex items-center gap-1 mt-1">
          {[...Array(6)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
        </div>
      </div>
    </motion.a>
  );
}
