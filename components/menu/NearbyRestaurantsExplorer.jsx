"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  LocateFixed,
  MapPin,
  Store,
  Coffee,
  UtensilsCrossed,
  ArrowRight,
  LoaderCircle,
  Clock3,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchNearbyRestaurants } from "@/lib/restaurantApi";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

const LocationPicker = dynamic(
  () => import("@/components/location/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] animate-pulse rounded-3xl bg-white/10" />
    ),
  },
);

export default function NearbyRestaurantsExplorer() {
  const { lang } = useLanguage();
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [type, setType] = useState("all");
  const [openNow, setOpenNow] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState("all");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem("qregy-customer-location");
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    } catch {
      // Ignore invalid cached location values.
    }
  }, []);

  useEffect(() => {
    if (!location?.isSet) {
      return;
    }

    try {
      localStorage.setItem("qregy-customer-location", JSON.stringify(location));
    } catch {
      // Ignore storage issues.
    }
  }, [location]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!location?.isSet) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchNearbyRestaurants({
          lat: location.lat,
          lng: location.lng,
          radius,
          type,
          openNow,
          deliverySpeed,
        });
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch nearby restaurants", error);
        toast.error(
          lang === "ar"
            ? "تعذر تحميل المطاعم القريبة"
            : "Failed to load nearby restaurants",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [lang, location, radius, type, openNow, deliverySpeed]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-8 md:px-6 md:pt-12">
      <section className="overflow-hidden rounded-[34px] border border-white/15 bg-gradient-to-br from-orange-500/20 via-amber-400/10 to-cyan-500/15 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.75)] backdrop-blur-md">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8 lg:p-10">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-4 py-1 text-xs font-semibold tracking-wide text-white/80">
              {lang === "ar"
                ? "اكتشف المطاعم الأقرب لك"
                : "Discover restaurants near you"}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                {lang === "ar"
                  ? "اختار مطعمك حسب موقعك وابدأ الطلب فورًا"
                  : "Choose your restaurant by location and start ordering instantly"}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/80 md:text-base">
                {lang === "ar"
                  ? "حدد مكانك الحالي أو ابحث عن منطقتك، وسنعرض لك المطاعم والكافيهات القريبة الجاهزة لاستقبال الطلبات."
                  : "Set your current location or search your area, and we will show nearby restaurants and coffee shops ready to receive orders."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                <p className="font-semibold">
                  {lang === "ar" ? "تحديد موقع لحظي" : "Live location"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                <p className="font-semibold">
                  {lang === "ar"
                    ? "مطاعم قريبة بالفعل"
                    : "Truly nearby restaurants"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                <p className="font-semibold">
                  {lang === "ar" ? "دخول سريع للمنيو" : "Fast menu access"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/15 bg-black/30 p-4">
            <LocationPicker value={location} onChange={setLocation} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[30px] border border-white/10 bg-black/20 p-4 backdrop-blur-md md:grid-cols-5 md:items-end md:p-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/85">
            {lang === "ar" ? "نوع النشاط" : "Business type"}
          </label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/10 bg-background/80 px-4 text-sm"
          >
            <option value="all">{lang === "ar" ? "الكل" : "All"}</option>
            <option value="restaurant">
              {lang === "ar" ? "مطاعم" : "Restaurants"}
            </option>
            <option value="coffee">
              {lang === "ar" ? "كافيهات" : "Coffee shops"}
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/85">
            {lang === "ar" ? "المسافة القصوى" : "Max distance"}
          </label>
          <select
            value={String(radius)}
            onChange={(event) => setRadius(Number(event.target.value))}
            className="h-11 rounded-2xl border border-white/10 bg-background/80 px-4 text-sm"
          >
            {[3, 5, 10, 15, 20].map((distance) => (
              <option key={distance} value={distance}>
                {distance} km
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/85">
            {lang === "ar" ? "سرعة التوصيل" : "Delivery speed"}
          </label>
          <select
            value={deliverySpeed}
            onChange={(event) => setDeliverySpeed(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/10 bg-background/80 px-4 text-sm"
          >
            <option value="all">
              {lang === "ar" ? "أي سرعة" : "Any speed"}
            </option>
            <option value="fast">{lang === "ar" ? "سريع" : "Fast"}</option>
            <option value="standard">
              {lang === "ar" ? "متوسط" : "Standard"}
            </option>
            <option value="slow">{lang === "ar" ? "هادي" : "Slow"}</option>
          </select>
        </div>

        <label className="flex h-11 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-background/80 px-4">
          <input
            type="checkbox"
            checked={openNow}
            onChange={(event) => setOpenNow(event.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold">
            {lang === "ar" ? "مفتوح الآن" : "Open now"}
          </span>
        </label>

        <Button
          type="button"
          onClick={() =>
            setLocation((current) => (current ? { ...current } : current))
          }
          disabled={!location?.isSet || isLoading}
          className="h-11 rounded-2xl"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          {lang === "ar" ? "تحديث النتائج" : "Refresh results"}
        </Button>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white">
              {lang === "ar" ? "المطاعم القريبة منك" : "Restaurants near you"}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              {location?.isSet
                ? lang === "ar"
                  ? `${restaurants.length} نتيجة حول ${location.address}`
                  : `${restaurants.length} results around ${location.address}`
                : lang === "ar"
                  ? "حدد موقعك أولًا لعرض النتائج"
                  : "Set your location first to show results"}
            </p>
          </div>
        </div>

        {!location?.isSet ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-black/20 p-10 text-center text-white/70">
            {lang === "ar"
              ? "ابدأ بتحديد موقعك الحالي أو اختيار موقع من الخريطة."
              : "Start by setting your current location or choosing a point on the map."}
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-[28px] bg-white/10"
              />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-black/20 p-10 text-center text-white/70">
            {lang === "ar"
              ? "لا توجد مطاعم ضمن النطاق الحالي. جرّب توسيع المسافة أو تغيير موقعك."
              : "No restaurants found in the current range. Try increasing the distance or changing your location."}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => {
              const href = `/menu?restaurant=${restaurant.id}&user=${restaurant.user_id}&token=${restaurant.token}`;
              const isCoffee = restaurant.type === "coffee";

              return (
                <article
                  key={restaurant.id}
                  className="group overflow-hidden rounded-[30px] border border-white/10 bg-black/30 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm"
                >
                  <div className="relative h-52 overflow-hidden">
                    {restaurant.cover ? (
                      <img
                        src={restaurant.cover}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-orange-500/25 to-cyan-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white">
                        {isCoffee ? (
                          <Coffee className="h-3.5 w-3.5" />
                        ) : (
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                        )}
                        {lang === "ar"
                          ? isCoffee
                            ? "كافيه"
                            : "مطعم"
                          : isCoffee
                            ? "Coffee"
                            : "Restaurant"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            restaurant.is_open_now
                              ? "border border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
                              : "border border-rose-300/30 bg-rose-400/15 text-rose-100"
                          }`}
                        >
                          {lang === "ar"
                            ? restaurant.is_open_now
                              ? "مفتوح"
                              : "مغلق"
                            : restaurant.is_open_now
                              ? "Open"
                              : "Closed"}
                        </span>
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100">
                          {Number(restaurant.distance_km).toFixed(1)} km
                        </span>
                      </div>
                    </div>

                    {restaurant.logo ? (
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="absolute bottom-4 left-4 h-16 w-16 rounded-2xl border border-white/15 object-cover shadow-lg"
                      />
                    ) : null}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">
                        {restaurant.name}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-6 text-white/65">
                        {restaurant.address}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5">
                        <Store className="h-3.5 w-3.5" />
                        {lang === "ar"
                          ? `${restaurant.menus_count || 0} منيو`
                          : `${restaurant.menus_count || 0} menus`}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {lang === "ar"
                          ? `حتى ${restaurant.delivery_radius_km || radius} كم`
                          : `up to ${restaurant.delivery_radius_km || radius} km`}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {lang === "ar"
                          ? `${restaurant.eta_minutes || "--"} دقيقة`
                          : `${restaurant.eta_minutes || "--"} min`}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5">
                        <Bike className="h-3.5 w-3.5" />
                        {lang === "ar"
                          ? restaurant.delivery_speed === "fast"
                            ? "سريع"
                            : restaurant.delivery_speed === "standard"
                              ? "متوسط"
                              : "هادي"
                          : restaurant.delivery_speed === "fast"
                            ? "Fast"
                            : restaurant.delivery_speed === "standard"
                              ? "Standard"
                              : "Slow"}
                      </span>
                    </div>

                    <Link
                      href={href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
                    >
                      {lang === "ar" ? "افتح المنيو" : "Open Menu"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
