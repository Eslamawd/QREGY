"use client";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { connectSocket, joinOrder, onOrderUpdated } from "@/services/socket";
import { useCurrency } from "@/context/CurrencyContext";

export default function OrdersShow({ restaurant_id, user_id, token }) {
  const {
    orders,
    currentOrder,
    totalPrice,
    removeFromOrder,
    submitOrder,
    clearOrderLocal,
    setStatus,
  } = useOrder();

  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const isArabic = lang === "ar";

  // ✅ عند تشغيل الصفحة، نربط كل الأوردرات الحالية بالسوكت
  useEffect(() => {
    if (orders.length > 0) {
      connectSocket();
      orders.forEach((order) => {
        if (order.id) joinOrder(order.id);
      });

      // ✅ عند استلام تحديث
      onOrderUpdated(({ order_id, status }) => {
        setStatus(order_id, status);
        if (status === "payid") {
          clearOrderLocal(order_id);
        }
      });
    }
  }, [orders]);

  // ✅ إرسال الطلب الحالي
  const handleSend = async () => {
    const res = await submitOrder(restaurant_id, user_id, token);
    if (res?.id) {
      connectSocket();
      joinOrder(res.id);
      onOrderUpdated(({ order_id, status }) => {
        setStatus(order_id, status);
      });
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
    <div className="container mx-auto py-10 font-cairo px-4 bg-blue-900 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        {isArabic ? "كل الطلبات" : "All Orders"}
      </h1>

      {/* ✅ الطلب الحالي قبل الإرسال */}
      {currentOrder.items?.length > 0 && (
        <div className="bg-white/10 rounded-lg p-4 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">
            {isArabic ? "طلب جاري الإعداد" : "Current (Not Sent)"}
          </h2>

          {currentOrder.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center mb-3 border-b border-gray-200 pb-2"
            >
              <div>
                <p className="text-white">
                  {isArabic ? item.name : item.name_en} × {item.quantity}
                </p>
                <p className="text-gray-200 text-sm">
                  {formatPrice(item.price)}
                </p>
              </div>
              {item.options?.length > 0 && (
                <ul className="text-gray-300 text-sm">
                  {item.options.map((opt) => (
                    <li key={opt.id}>
                      • {isArabic ? opt.name : opt.name_en} (+
                      {formatPrice(opt.price)})
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-gray-200 text-sm">{item.comment}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromOrder(item.id)}
              >
                {isArabic ? "حذف" : "Remove"}
              </Button>
            </div>
          ))}

          <div className="text-center mt-4">
            <p className="text-lg font-semibold text-white">
              {isArabic ? "الإجمالي:" : "Total:"}{" "}
              {formatPrice(totalPrice.toFixed(2))}
            </p>
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
          <h2 className="text-xl font-semibold mb-4 text-white">
            {isArabic ? "الطلبات السابقة" : "Sent Orders"}
          </h2>

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 rounded-lg p-4 mb-6 border border-white/20"
            >
              <h3 className="text-lg font-bold text-blue-100 mb-2">
                #{order.id} —{" "}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    order.status === "pending"
                      ? "bg-red-500"
                      : order.status === "in_progress"
                      ? "bg-yellow-500"
                      : "bg-green-500"
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
                      : "غير معروف"
                    : order.status.replace("_", " ")}
                </span>
              </h3>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-1 mb-1"
                >
                  <p className="text-white">
                    {isArabic ? item.name : item.name_en} × {item.quantity}
                  </p>
                  <p className="text-gray-200 text-sm">
                    {formatPrice(item.price)}
                  </p>

                  {item.options?.length > 0 && (
                    <ul className="text-gray-300 text-sm">
                      {item.options.map((opt) => (
                        <li key={opt.id}>
                          • {isArabic ? opt.name : opt.name_en} (+
                          {formatPrice(opt.price)})
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-gray-200 text-sm">{item.comment}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
