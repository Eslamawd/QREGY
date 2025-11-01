"use client";
import { addNewOrder } from "@/lib/orderApi";
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // ✅ كل الطلبات المحفوظة (قديمة + جديدة)
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ الطلب الحالي اللي المستخدم بيجهزه دلوقتي
  const [currentOrder, setCurrentOrder] = useState(() => ({
    items: [],
    restaurant_id: null,
    table_id: null,
    status: "pending",
  }));

  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ حساب السعر الكلي للطلب الحالي
  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    const total = currentOrder.items.reduce((acc, item) => {
      const itemPrice =
        (parseFloat(item.price) +
          item.options.reduce(
            (sum, opt) => sum + parseFloat(opt.price || 0),
            0
          )) *
        item.quantity;
      return acc + itemPrice;
    }, 0);

    setTotalPrice(total);
  }, [currentOrder]);

  // ✅ إضافة صنف للطلب الحالي
  const addToOrder = (item, quantity = 1, options = []) => {
    setCurrentOrder((prev) => {
      const safePrev = prev?.items
        ? prev
        : { items: [], restaurant_id: null, table_id: null, status: "pending" };
      const exists = safePrev.items.find((i) => i.id === item.id);
      if (exists) {
        return {
          ...safePrev,
          items: safePrev.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  options: [...i.options, ...options],
                  comment: item.comment || i.comment,
                }
              : i
          ),
        };
      }
      return {
        ...safePrev,
        items: [...safePrev.items, { ...item, quantity, options }],
      };
    });
  };

  // ✅ حذف صنف
  const removeFromOrder = (itemId) => {
    setCurrentOrder((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  const clearOrderLocal = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    localStorage.removeItem(`order_${orderId}`);
  };
  // ✅ تفريغ الطلب الحالي
  const clearOrder = () => {
    setCurrentOrder({
      items: [],
      restaurant_id: null,
      table_id: null,
      status: "pending",
    });
  };

  // ✅ بدء طلب جديد
  const startNewOrder = () => {
    clearOrder();
  };

  // ✅ تعيين المطعم والطاولة
  const setRestaurantId = (id) => {
    setCurrentOrder((prev) => ({ ...prev, restaurant_id: id }));
  };

  const setTableId = (id) => {
    setCurrentOrder((prev) => ({ ...prev, table_id: id }));
  };

  // ✅ تحديث حالة الطلب
  const setStatus = (orderId, status) => {
    // نحدث في قائمة الطلبات
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
      localStorage.setItem("orders", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ تجهيز البيانات للإرسال
  const preparePayload = () => ({
    restaurant_id: currentOrder.restaurant_id,
    table_id: currentOrder.table_id,
    total_price: totalPrice.toFixed(2),
    items: currentOrder.items.map((i) => ({
      item_id: i.id,
      comment: i.comment,
      quantity: i.quantity,
      options: i.options.map((opt) => opt.id),
    })),
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // ✅ إرسال الطلب إلى Laravel
  const submitOrder = async (restaurant_id, user_id, token) => {
    const payload = preparePayload();
    try {
      const res = await addNewOrder(payload, restaurant_id, user_id, token);

      if (res?.id) {
        const newOrder = { ...currentOrder, id: res.id, status: res.status };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        clearOrder(); // نفرّغ بعد الإرسال
      }

      console.log("✅ Order Created:", res);
      return res;
    } catch (err) {
      console.error("❌ Error sending order:", err);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orders,
        clearOrderLocal,
        addToOrder,
        removeFromOrder,
        clearOrder,
        startNewOrder,
        setRestaurantId,

        updateOrderStatus,
        setTableId,
        setStatus,
        totalPrice,
        submitOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
