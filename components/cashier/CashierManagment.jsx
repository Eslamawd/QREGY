import { getOrdersByCashier, updateOrderByCashier } from "@/lib/orderApi"; // ✅ تم تصحيح المسار
import React, { useEffect, useRef, useState } from "react";
import {
  connectSocket,
  joinCashier,
  onNewOrder,
  disconnectSocket,
  onOrderUpdated,
} from "@/services/socket"; // ✅ تم تصحيح المسار
import { toast } from "sonner";

function CashierManagment({ cashier, restaurant_id, user_id, token }) {
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

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

  const getOrders = async () => {
    try {
      const data = await getOrdersByCashier(
        cashier,
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

  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderByCashier(
        orderId,
        cashier,
        restaurant_id,
        user_id,
        token,
        { status }
      );

      setOrders((prev) => {
        const updated = prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        return status === "paid"
          ? updated.filter((order) => order.id !== orderId)
          : updated;
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("فشل تحديث حالة الطلب.");
    }
  };

  const handleNotifyNewOrder = (order) => {
    if (soundEnabled && audioRef.current) {
      const tryPlaySound = (attempt = 1) => {
        audioRef.current
          .play()
          .then(() => {
            console.log(`🔔 تم تشغيل صوت الإشعار في المحاولة رقم ${attempt}.`);
          })
          .catch((err) => {
            console.warn(`🔇 فشل تشغيل الصوت في المحاولة رقم ${attempt}:`, err);
            if (attempt === 1) {
              setTimeout(() => {
                tryPlaySound(2);
              }, 500);
            }
          });
      };
      tryPlaySound(1);
    }

    if (Notification.permission === "granted") {
      new Notification("💵 طلب جديد للكاشير", {
        body: `رقم الطلب: ${order.id}`,
        icon: "/qregylogo_192x192.png",
      });
    }

    if ("speechSynthesis" in window) {
      const utt = new SpeechSynthesisUtterance(
        `طلب جديد رقم ${order.id} يحتاج للدفع`
      );
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

  useEffect(() => {
    getOrders();

    const socket = connectSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Socket connected. Joining cashier...");
      joinCashier(restaurant_id, (response) => {
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

          handleNotifyNewOrder({ id: order_id });
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
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        لوحة تحكم الكاشير
      </h1>
      <p className="text-center text-sm text-gray-400 mb-6">
        حالة الاتصال:{" "}
        {socketRef.current?.connected ? (
          <span className="text-green-400">✅ متصل (فوري)</span>
        ) : (
          <span className="text-red-400">❌ غير متصل (يعتمد على المزامنة)</span>
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
            className={`rounded-xl shadow-lg p-4 border transition-all duration-300 ${
              order.status === "ready"
                ? "bg-green-900/50 border-green-600 ring-2 ring-green-500"
                : order.status === "delivered"
                ? "bg-blue-900/50 border-blue-600"
                : order.status === "cancelled"
                ? "bg-red-800 border-red-700"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-extrabold text-yellow-300">
                طلب #{order.id}
              </h2>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  order.status === "pending" || order.status === "cancelled"
                    ? "bg-red-500"
                    : order.status === "in_progress"
                    ? "bg-yellow-500"
                    : order.status === "ready"
                    ? "bg-green-500"
                    : order.status === "delivered"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              >
                {order.status === "pending"
                  ? "قيد الانتظار"
                  : order.status === "in_progress"
                  ? "جاري التحضير"
                  : order.status === "ready"
                  ? "جاهز للدفع"
                  : order.status === "delivered"
                  ? "تم التسليم"
                  : order.status === "cancelled"
                  ? "تم الإلغاء"
                  : "مدفوع"}
              </span>
            </div>

            <div className="mb-4 text-sm text-gray-300 border-b border-gray-700 pb-2">
              <p>
                <strong>الطاولة:</strong> {order.table?.name ?? "بدون طاولة"}
              </p>
              <p className="text-lg font-bold text-white">
                <strong>الإجمالي:</strong> {order.total_price} ج.م
              </p>
            </div>

            <div className="mb-4 max-h-48 overflow-y-auto custom-scrollbar">
              <p className="text-sm font-semibold text-yellow-400 mb-2">
                قائمة الأصناف:
              </p>
              <ul className="space-y-3">
                {order?.order_items?.map((item, i) => (
                  <li
                    key={i}
                    className="bg-gray-700 p-3 rounded-lg flex gap-3 items-start"
                  >
                    {/* استخدام Placeholder Image إذا لم تتوفر صورة */}
                    <img
                      src={
                        item.item?.image ||
                        `https://placehold.co/80x80/2d3748/ffffff?text=${item.item?.name?.substring(
                          0,
                          1
                        )}`
                      }
                      alt={item.item?.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/80x80/2d3748/ffffff?text=${item.item?.name?.substring(
                          0,
                          1
                        )}`;
                      }}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-lg text-white">
                        {item.item?.name} (x{item.quantity})
                      </p>
                      {item.options?.length > 0 && (
                        <p className="text-xs text-yellow-400 mt-0.5">
                          الخيارات:{" "}
                          {item.options.map((opt) => opt.name).join("، ")}
                        </p>
                      )}
                      {item.comment && (
                        <p className="text-xs text-red-300 mt-1 italic">
                          ملاحظة: {item.comment}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-700">
              {/* زر تم الدفع (للحالة Ready فقط) */}
              {order.status === "ready" && (
                <button
                  onClick={() => updateStatus(order.id, "payid")}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg text-sm font-semibold transition-transform duration-150 transform hover:scale-[1.02] shadow-md hover:shadow-yellow-400/50"
                >
                  تم الدفع
                </button>
              )}
              {/* زر الإلغاء (يمكن إضافته إذا كان مسموحًا) */}
              {order.status !== "payid" && order.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className="bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>
        ))}
        {/* ✅ هذا الجزء يظهر عندما تكون المصفوفة فارغة */}
        {orders.length === 0 && (
          <div className="md:col-span-3 text-center text-gray-500 py-12">
            <p className="text-2xl">لا توجد طلبات حالياً.</p>
            <p className="text-sm">سيتم تحديث الشاشة تلقائياً.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        /* Custom scrollbar for better mobile appearance */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #fca311;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #374151;
        }
      `}</style>
    </main>
  );
}

export default CashierManagment;
