import React, { useEffect, useRef, useState } from "react";
import { getOrdersByKitchen, updateOrderByKitchen } from "@/lib/orderApi";
import {
  connectSocket,
  joinKitchen,
  onNewOrder,
  onOrderUpdated,
  disconnectSocket,
} from "@/services/socket";
import InstallPrompt from "../InstallPrompt";
import { toast } from "sonner";

function KitchenManagment({ kitchen, restaurant_id, user_id, token }) {
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  // ✅ طلب إذن الإشعارات مرة واحدة فقط
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // ✅ تفعيل الصوت لتجاوز autoplay restriction
  const enableSound = async () => {
    try {
      audioRef.current.muted = true;
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      setSoundEnabled(true);
    } catch (err) {
      console.warn("🔇 لا يمكن تشغيل الصوت تلقائيًا:", err);
    }
  };

  // ✅ تحميل الطلبات من الـ API
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

      const sorted = data.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("حدث خطأ أثناء تحميل الطلبات.");
    }
  };

  // ✅ تحديث حالة الطلب
  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderByKitchen(
        orderId,
        kitchen,
        restaurant_id,
        user_id,
        token,
        { status }
      );

      // ✅ تحديث فوري محلي
      setOrders((prev) => {
        const updated = prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        // حذف الطلب من القائمة بعد التجهيز
        return status === "ready"
          ? updated.filter((order) => order.id !== orderId)
          : updated;
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("فشل تحديث حالة الطلب.");
    }
  };

  // ✅ إشعارات + صوت + نطق
  // ✅ إشعارات + صوت + نطق (مُحسَّن لـ iOS/Safari)
  const handleNotifyNewOrder = (order) => {
    // 1. تشغيل الصوت
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;

      // 🚀 التعديل الهام: استخدام .then().catch() لضمان معالجة فشل التشغيل التلقائي
      const tryPlaySound = (attempt = 1) => {
        audioRef.current
          .play()
          .then(() => {
            // التشغيل نجح
            console.log(`🔔 تم تشغيل صوت الإشعار في المحاولة رقم ${attempt}.`);
          })
          .catch((err) => {
            // ❌ فشل التشغيل
            console.warn(`🔇 فشل تشغيل الصوت في المحاولة رقم ${attempt}:`, err);

            // **🚨 المحاولة الثانية المؤجلة (Retrial Logic)**
            if (attempt === 1) {
              console.log("🔄 محاولة ثانية لتشغيل الصوت بعد 500ms...");
              setTimeout(() => {
                tryPlaySound(2); // المحاولة الثانية
              }, 500);
            }
          });
      };

      // ابدأ بالمحاولة الأولى
      tryPlaySound(1);
    }

    // 2. الإشعار التقليدي
    if (Notification.permission === "granted") {
      new Notification("🍔 طلب جديد", {
        body: `رقم الطلب: ${order.id}`,
        icon: "/qregylogo.jpg",
      });
    }

    // 3. النطق الصوتي (Speech Synthesis)
    if ("speechSynthesis" in window) {
      const utt = new SpeechSynthesisUtterance(`طلب جديد رقم ${order.id}`);
      utt.lang = "ar-SA";
      utt.rate = 0.9;
      utt.pitch = 1;
      const voice = speechSynthesis
        .getVoices()
        .find((v) => v.lang.startsWith("ar"));
      if (voice) utt.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    }
  };

  // ✅ إعداد WebSocket
  useEffect(() => {
    getOrders();

    const socket = connectSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Socket connected. Joining kitchen...");
      joinKitchen(restaurant_id, (response) => {
        console.log("✅ Joined room:", response.room);

        socket.off("newOrder");
        socket.off("orderUpdated");

        onOrderUpdated(({ order_id, status }) => {
          setOrders((prev) => {
            const updated = prev.map((o) =>
              o.id === order_id ? { ...o, status } : o
            );
            return updated.sort((a, b) => b.id - a.id);
          });
        });

        onNewOrder((order) => {
          toast.success(`🔔 طلب جديد! طاولة ${order.table?.name ?? order.id}`);
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === order.id);
            const updated = exists
              ? prev.map((o) => (o.id === order.id ? order : o))
              : [...prev, order];
            return updated.sort((a, b) => b.id - a.id);
          });
          handleNotifyNewOrder(order);
        });
      });
    };

    socket.on("connect", handleConnect);

    // ✅ Fallback Polling كل 10 دقايق
    const intervalId = setInterval(() => {
      if (!socket.connected) {
        console.log("🔄 Socket disconnected. Polling orders...");
        getOrders();
      }
    }, 600000);

    return () => {
      clearInterval(intervalId);
      socket.off("connect", handleConnect);
      socket.off("newOrder");
      socket.off("orderUpdated");
      disconnectSocket();
    };
  }, []);

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🍳 لوحة تحكم المطبخ
      </h1>

      <InstallPrompt />

      <p className="text-center text-sm text-gray-400 mb-6">
        حالة الاتصال:{" "}
        {socketRef.current?.connected ? (
          <span className="text-green-400">✅ متصل (فوري)</span>
        ) : (
          <span className="text-red-400">❌ غير متصل (مزامنة دورية فقط)</span>
        )}
      </p>

      {!soundEnabled && (
        <div className="mb-4 text-center">
          <button
            onClick={enableSound}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md"
          >
            تفعيل إشعارات الصوت 🔔
          </button>
          <p className="text-sm text-gray-300 mt-2">
            اضغط مرة واحدة لتفعيل الصوت والنطق والإشعارات
          </p>
        </div>
      )}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/ding.mp3" type="audio/mpeg" />
        <source src="/sounds/ding.ogg" type="audio/ogg" />
      </audio>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders?.map((order) => (
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
                    ? "bg-yellow-500 text-black"
                    : order.status === "cancelled"
                    ? "bg-gray-600"
                    : "bg-green-500 text-black"
                }`}
              >
                {order.status === "pending"
                  ? "قيد الانتظار"
                  : order.status === "in_progress"
                  ? "جاري التحضير"
                  : order.status === "cancelled"
                  ? "تم الإلغاء"
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

            <div className="mb-4 max-h-56 overflow-y-auto custom-scrollbar">
              {order.order_items?.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-800 p-2 rounded-lg mb-2 flex items-center gap-3"
                >
                  <img
                    src={item.item?.image ?? "/placeholder.png"}
                    alt={item.item?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.item?.name}</p>
                    {item.options?.length > 0 && (
                      <p className="text-xs text-gray-300">
                        خيارات: {item.options.map((opt) => opt.name).join("، ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      الكمية: {item.quantity}
                    </p>
                    {item.comment && (
                      <p className="text-xs text-yellow-400 italic">
                        ملاحظة: {item.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "in_progress")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded w-full"
                >
                  جاري التحضير
                </button>
              )}
              {order.status === "in_progress" && (
                <button
                  onClick={() => updateStatus(order.id, "ready")}
                  className="bg-green-500 hover:bg-green-600 text-black px-3 py-2 rounded w-full"
                >
                  جاهز للتسليم
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="md:col-span-3 text-center text-gray-500 py-10">
            <p className="text-xl">لا توجد طلبات حالياً</p>
            <p className="text-sm">سيتم تحديث الشاشة تلقائياً.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #facc15;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
      `}</style>
    </main>
  );
}

export default KitchenManagment;
