import { getOrdersByKitchen, updateOrderByKitchen } from "@/lib/orderApi";
import React, { useEffect, useRef, useState } from "react";
import {
  connectSocket,
  joinKitchen,
  onNewOrder,
  disconnectSocket,
  onSocketConnect,
} from "@/services/socket";
import InstallPrompt from "../InstallPrompt";

function KitchenManagment({ kitchen, restaurant_id, user_id, token }) {
  const [orders, setOrders] = useState([]);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    getOrders();

    const socket = connectSocket();

    // ✅ يسمع على الطلبات الجديدة
    // ✅ الحل: ننتظر حتى يتصل الـ Socket ثم ننفذ أوامر الانضمام والاشتراك
    const handleConnect = () => {
      console.log("✅ Socket connected. Joining kitchen room...");
      joinKitchen(restaurant_id, (response) => {
        console.log(
          `✅ Room join confirmed: ${response.room}. Subscribing to events.`
        );

        onNewOrder((order) => {
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === order.id);
            let updated = exists
              ? prev.map((o) => (o.id === order.id ? order : o))
              : [...prev, order];

            // ✅ ترتيب الطلبات من الأكبر إلى الأصغر (30 فوق، 29 بعده)
            updated.sort((a, b) => b.id - a.id);
            return updated;
          });
          if (Notification.permission === "granted") {
            new Notification("🍔 طلب جديد", {
              body: `رقم الطلب: ${order.id}`,
              icon: "/icons/order.png", // تقدر تحط لوجو أو أي صورة
            });
          }

          console.log("🍔 New Order:", order);

          // صوت/نطق عند الطلب الجديد
          const notifySound = new Audio("/sounds/ding.mp3");
          notifySound.play();
          handleNotifyNewOrder(order);
        });
      }); // ✅ يدخل روم المطبخ
    };
    socket.on("connect", handleConnect);
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      // تنظيف الحدث عند الخروج
      socket.off("connect", handleConnect);
      disconnectSocket();
    };
  }, []);

  const getOrders = async () => {
    try {
      const data = await getOrdersByKitchen(
        kitchen,
        restaurant_id,
        user_id,
        token
      );
      if (data?.active === false) {
        toast.error("⚠️ انتهى اشتراك المطعم، يرجى التجديد للاستمرار.");
        return;
      }
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const state = { status: status };
      // ✅ API Request لتحديث الطلب
      const stateOrder = updateOrderByKitchen(
        orderId,
        kitchen,
        restaurant_id,
        user_id,
        token,
        state
      );

      // ✅ تعديل محلي (Optimistic UI)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      if (status === "ready") {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      }

      // ✅ إرسال للسيرفر عبر socket (real-time)
      // socket.emit("updateOrderStatus", { orderId, status });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // === Notification helpers ===
  const enableSound = async () => {
    // تفاعل مستخدم مطلوب لتفادي قيود autoplay
    try {
      // لمثال: نشغل ملف صغير واحد مرة كـ "gesture"
      await audioRef.current?.play();
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
    } catch (e) {
      console.warn("Couldn't play audio on gesture", e);
    }
    setSoundEnabled(true);
  };

  const handleNotifyNewOrder = (order) => {
    // 1) تشغيل ملف صوتي قصير (beep/ding)
    if (soundEnabled) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn("Audio play blocked:", err);
        });
      } catch (e) {
        console.warn(e);
      }
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Notification permission granted");
        } else {
          console.log("❌ Notification permission denied");
        }
      });
    }

    // 2) استخدام Web Speech API للنطق (fallback أو إضافي)
    if ("speechSynthesis" in window) {
      const text = `   New Order Number ${order.id}`;
      const utt = new SpeechSynthesisUtterance(text);
      // لو عايز صوت عربي:
      utt.lang = "ar-EG"; // Egyptian Arabic suggestion
      // ضبط سرعة/نبرة لو حبيت:
      utt.rate = 0.8;
      utt.pitch = 0.8;
      // نطق
      window.speechSynthesis.cancel(); // إلغاء أي نطق سابق
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🍳 لوحة تحكم المطبخ
      </h1>
      <InstallPrompt />

      {/* زر لتفعيل الصوت (مطلوب لتمرير سياسات المتصفح) */}
      {!soundEnabled && (
        <div className="mb-4 text-center">
          <button
            onClick={enableSound}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            تفعيل إشعارات الصوت 🔔
          </button>
          <p className="text-sm text-gray-300 mt-2">
            إضغط مرة واحدة فقط لتفعيل الصوت
          </p>
        </div>
      )}

      {/* عنصر صوت - ضع ملفك هنا أو استخدم base64 أو رابط */}
      <audio
        ref={audioRef}
        preload="auto"
        // استبدل المسار بصوتك: short ding/wav/mp3
        src="/sounds/ding.mp3"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-900 rounded-xl shadow-md p-4 border border-gray-700 hover:shadow-yellow-400/20 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">طلب #{order.id}</h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  order.status === "pending"
                    ? "bg-red-500"
                    : order.status === "in_progress"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {order.status === "pending"
                  ? "قيد الانتظار"
                  : order.status === "in_progress"
                  ? "جاري التحضير"
                  : "جاهز"}
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-300">
              <p>
                <strong>الطاولة:</strong> {order.table?.name ?? "بدون طاولة"}
              </p>
              <p>
                <strong>الإجمالي:</strong> {order.total_price} ج.م
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-400 mb-1">
                المحتويات:
              </p>
              <ul className="space-y-2">
                {order.order_items.map((item, i) => (
                  <li key={i} className="bg-gray-800 p-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.item?.image ?? "/placeholder.png"}
                        alt={item.item?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.item?.name}</p>
                        <p className="text-xl text-gray-200">
                          خيارات :
                          {item.options?.length > 0 &&
                            item.options.map((opt) => opt.name).join("، ")}
                        </p>
                        <p className="text-xl">الكمية: {item.quantity}</p>
                        <p className="text-xl">تعليق: {item.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ أزرار تغيير الحالة */}
            <div className="flex gap-2">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "in_progress")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                >
                  جاري التحضير
                </button>
              )}
              {order.status === "in_progress" && (
                <button
                  onClick={() => updateStatus(order.id, "ready")}
                  className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded"
                >
                  جاهز للتسليم
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default KitchenManagment;
