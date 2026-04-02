"use client";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { connectSocket, joinOrder, onOrderUpdated } from "@/services/socket";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrderByUser } from "@/lib/orderApi";
import { MapPin, Navigation, Loader2, CheckCircle2 } from "lucide-react";

export default function OrdersShow({ restaurant_id, user_id, token }) {
  const {
    orders,
    currentOrder,
    totalPrice,
    removeFromOrder,
    submitOrder,
    clearOrderLocal,
    setStatus,
    deliveryAddress,
    setDeliveryAddress,
    customerLocation,
    setCustomerLocation,
  } = useOrder();

  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const isArabic = lang === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const addressRef = useRef(null);

  const detectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError(t("المتصفح لا يدعم GPS", "GPS not supported"));
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isSet: true,
        };
        setCustomerLocation(loc);
        localStorage.setItem("qregy-customer-location", JSON.stringify(loc));

        // ── Reverse geocoding: تحويل الإحداثيات لعنوان مقروء ──
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=jsonv2&accept-language=${isArabic ? "ar" : "en"}`,
            { headers: { "Accept-Language": isArabic ? "ar" : "en" } },
          );
          if (res.ok) {
            const data = await res.json();
            const addr =
              data.display_name ||
              [
                data.address?.road,
                data.address?.suburb,
                data.address?.city || data.address?.town || data.address?.village,
                data.address?.country,
              ]
                .filter(Boolean)
                .join("، ");
            if (addr) {
              setDeliveryAddress(addr);
            }
          }
        } catch {
          // Reverse geocoding failed silently — user can type manually
        }

        setGpsLoading(false);
      },
      () => {
        setGpsError(t("تعذّر تحديد موقعك", "Could not determine your location"));
        setGpsLoading(false);
      },
      { timeout: 8000 },
    );
  };

  // ✅ عند تشغيل الصفحة، نربط كل الأوردرات الحالية بالسوكت
  useEffect(() => {
    const refreshOrders = async () => {
      try {
        if (orders.length > 0) {
          for (const ord of orders) {
            const order = await getOrderByUser(
              ord.id,
              restaurant_id,
              user_id,
              token,
            );
            setStatus(order.id, order.status);
            if (order.status === "payid") {
              clearOrderLocal(order.id);
            }
          }
        }
      } catch (error) {
        console.error("Error refreshing orders:", error);
      }
    };

    const interval = setInterval(refreshOrders, 600000); // كل دقيقة
    return () => clearInterval(interval);
  }, [orders, restaurant_id, user_id, token, setStatus, clearOrderLocal]);

  useEffect(() => {
    const socket = connectSocket();

    const joinAllOrders = () => {
      if (orders.length > 0) {
        orders.forEach((order) => {
          if (order.id) {
            joinOrder(order.id);
          }
        });
      }
    };
    const handleOrderUpdate = ({ order_id, status }) => {
      setStatus(order_id, status);
      if (status === "payid") {
        clearOrderLocal(order_id);
      }
    };

    onOrderUpdated(handleOrderUpdate);
    joinAllOrders();
    // 4. التنظيف (ضروري)
    return () => {
      // إلغاء اشتراك المستمع لتجنب تكرار setStatus
      socket.off("order_updated", handleOrderUpdate); // ليس من الضروري فصل الـ Socket هنا إذا كان التطبيق يعتمد عليه بشكل مستمر // disconnectSocket();
    };
  }, [orders.length, setStatus, clearOrderLocal]);

  // ✅ إرسال الطلب الحالي
  const handleSend = async () => {
    try {
      const res = await submitOrder(restaurant_id, user_id, token);
      if (res?.id) {
        // 🚨 لا نحتاج للاشتراك مرة أخرى، فالاشتراك تم في useEffect
        joinOrder(res.id); // فقط ننضم إلى غرفة الطلب الجديد
      }
    } catch {
      // Error toast is shown from OrderContext.
    }
  };

  // ✅ لو مفيش طلبات ولا حالية
  if (
    (!currentOrder.items || currentOrder.items.length === 0) &&
    orders.length === 0
  )
    return (
      <p className="text-center mt-10 font-cairo text-lg">
        {isArabic ? "لا توجد طلبات بعد" : "No orders yet"}
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-10 font-cairo sm:px-6 lg:px-8">
      <h1 className="mb-6 text-center text-2xl font-black text-slate-900 dark:text-white">
        {isArabic ? "كل الطلبات" : "All Orders"}
      </h1>

      {/* ✅ الطلب الحالي قبل الإرسال */}
      {currentOrder.items?.length > 0 && (
        <div className="mb-10 rounded-2xl border border-white/20 bg-white/70 p-4 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.55)] backdrop-blur-md dark:border-white/10 dark:bg-white/6">
          <h2 className="mb-4 text-xl font-semibold text-orange-600 dark:text-yellow-300">
            {isArabic ? "طلب جاري الإعداد" : "Current (Not Sent)"}
          </h2>

          {currentOrder.items.map((item, index) => (
            <div
              key={item.line_key || `${item.id}-${index}`}
              className="mb-3 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/75 p-3 sm:flex-row dark:border-white/10 dark:bg-white/8"
            >
              <img
                className="h-20 w-20 rounded-xl object-cover"
                src={item.image}
                alt={item.name}
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {isArabic ? item.name : item.name_en} × {item.quantity}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300/80">
                  {formatPrice(item.price)}
                </p>
              </div>
              {item.options?.length > 0 && (
                <ul className="text-sm text-slate-500 dark:text-slate-300/70">
                  {item.options.map((opt) => (
                    <li key={opt.id}>
                      • {isArabic ? opt.name : opt.name_en} (+
                      {formatPrice(opt.price)})
                    </li>
                  ))}
                </ul>
              )}
              {!!item.comment && (
                <p className="text-sm text-slate-500 dark:text-slate-300/70">
                  {item.comment}
                </p>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromOrder(item.line_key || item.id)}
              >
                {isArabic ? "حذف" : "Remove"}
              </Button>
            </div>
          ))}

          <div className="text-center mt-4">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {isArabic ? "الإجمالي:" : "Total:"}{" "}
              {formatPrice(totalPrice.toFixed(2))}
            </p>

            {/* ───── قسم العنوان / اللوكيشن (Talabat style) ───── */}
            <div className="mt-5 rounded-2xl border border-orange-200/60 bg-orange-50/60 p-4 text-left dark:border-orange-400/20 dark:bg-orange-950/30">
              <p className="mb-3 flex items-center gap-2 font-semibold text-orange-700 dark:text-orange-300">
                <MapPin className="h-4 w-4 shrink-0" />
                {t("عنوان التوصيل", "Delivery Address")}
              </p>

              {/* GPS button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-3 flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-500/40 dark:text-orange-300 dark:hover:bg-orange-900/30"
                onClick={detectGPS}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : customerLocation ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {gpsLoading
                  ? t("جارٍ تحديد موقعك…", "Detecting location…")
                  : customerLocation
                    ? t("تم تحديد موقعك ✓", "Location detected ✓")
                    : t("استخدم موقعي الحالي (GPS)", "Use my current location (GPS)")}
              </Button>

              {/* manual address textarea */}
              <textarea
                ref={addressRef}
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={t(
                  "أو اكتب عنوانك (شارع، منطقة، علامة مميزة…)",
                  "Or type your address (street, area, landmark…)",
                )}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/40"
              />

              {gpsError && (
                <p className="mt-1 text-xs text-red-500">{gpsError}</p>
              )}

              {customerLocation && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  📍 {customerLocation.lat.toFixed(5)}, {customerLocation.lng.toFixed(5)}
                </p>
              )}
            </div>
            {/* ──────────────────────────────────────────────────── */}

            <Button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-3"
            >
              {isArabic ? "إرسال الطلب" : "Submit Order"}
            </Button>
          </div>
        </div>
      )}

      {/* ✅ الطلبات اللي اتبعتت */}
      {orders.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            {isArabic ? "الطلبات السابقة" : "Sent Orders"}
          </h2>

          {orders?.map((order) => (
            <div
              key={order.id}
              className="mb-6 rounded-2xl border border-white/20 bg-white/70 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/6"
            >
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-blue-100">
                #{order.id} —{" "}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    order.status === "pending"
                      ? "bg-blue-500"
                      : order.status === "in_progress"
                        ? "bg-yellow-500"
                        : order.status === "ready"
                          ? "bg-green-500"
                          : "bg-red-500"
                  }`}
                >
                  {isArabic
                    ? order.status === "pending"
                      ? "قيد الانتظار"
                      : order.status === "in_progress"
                        ? "قيد التنفيذ"
                        : order.status === "ready"
                          ? "جاهز"
                          : order.status === "delivered"
                            ? "تم التوصيل"
                            : order.status === "cancelled"
                              ? "تم الإلغاء"
                              : "غير معروف"
                    : order.status.replace("_", " ")}
                </span>
              </h3>

              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="mb-1 flex items-center justify-between border-b border-slate-200/70 pb-1 dark:border-white/10"
                >
                  <img
                    className="h-20 w-20 rounded-xl object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {isArabic ? item.name : item.name_en} × {item.quantity}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300/80">
                    {formatPrice(item.price)}
                  </p>

                  {item.options?.length > 0 && (
                    <ul className="text-sm text-slate-500 dark:text-slate-300/70">
                      {item.options.map((opt) => (
                        <li key={opt.id}>
                          • {isArabic ? opt.name : opt.name_en} (+
                          {formatPrice(opt.price)})
                        </li>
                      ))}
                    </ul>
                  )}
                  {!!item.comment && (
                    <p className="text-sm text-slate-500 dark:text-slate-300/70">
                      {item.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
