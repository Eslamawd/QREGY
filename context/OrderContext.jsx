"use client";
import { addNewOrder, getOrderByUser } from "@/lib/orderApi";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const OrderContext = createContext();

const normalizeComment = (value) => (value || "").trim();

const buildLineKey = (itemId, options = [], comment = "") => {
  const optionIds = options
    .map((opt) => Number(opt.id))
    .filter(Boolean)
    .sort((a, b) => a - b)
    .join("-");

  return `${itemId}::${optionIds}::${normalizeComment(comment)}`;
};

const resolveExistingLineKey = (lineItem) =>
  lineItem.line_key ||
  buildLineKey(lineItem.id, lineItem.options || [], lineItem.comment || "");

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
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);

  // ✅ حساب السعر الكلي للطلب الحالي
  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    const total = currentOrder.items.reduce((acc, item) => {
      const itemPrice =
        (parseFloat(item.price) +
          item.options.reduce(
            (sum, opt) => sum + parseFloat(opt.price || 0),
            0,
          )) *
        item.quantity;
      return acc + itemPrice;
    }, 0);

    setTotalPrice(total);
  }, [currentOrder]);

  // ✅ إضافة صنف للطلب الحالي
  const addToOrder = (item, quantity = 1, options = []) => {
    const lineKey = buildLineKey(item.id, options, item.comment);

    setCurrentOrder((prev) => {
      const safePrev = prev?.items
        ? prev
        : { items: [], restaurant_id: null, table_id: null, status: "pending" };

      const exists = safePrev.items.find(
        (lineItem) => resolveExistingLineKey(lineItem) === lineKey,
      );

      if (exists) {
        return {
          ...safePrev,
          items: safePrev.items.map((lineItem) =>
            resolveExistingLineKey(lineItem) === lineKey
              ? {
                  ...lineItem,
                  line_key: lineKey,
                  quantity: lineItem.quantity + quantity,
                }
              : lineItem,
          ),
        };
      }

      return {
        ...safePrev,
        items: [
          ...safePrev.items,
          { ...item, quantity, options, line_key: lineKey },
        ],
      };
    });
  };

  // ✅ حذف صنف
  const removeFromOrder = (lineKeyOrItemId) => {
    setCurrentOrder((prev) => ({
      ...prev,
      items: prev.items.filter((lineItem) => {
        const existingLineKey = resolveExistingLineKey(lineItem);
        return (
          existingLineKey !== lineKeyOrItemId &&
          String(lineItem.id) !== String(lineKeyOrItemId)
        );
      }),
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
    setDeliveryAddress("");
    setCustomerLocation(null);
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
        o.id === orderId ? { ...o, status } : o,
      );
      localStorage.setItem("orders", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ تجهيز البيانات للإرسال
  const preparePayload = () => {
    let resolvedLocation = customerLocation;

    if (!resolvedLocation) {
      try {
        const savedLocation = localStorage.getItem("qregy-customer-location");
        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          if (parsed?.isSet && parsed?.lat && parsed?.lng) {
            resolvedLocation = parsed;
          }
        }
      } catch {
        // Ignore invalid location cache.
      }
    }

    return {
      restaurant_id: currentOrder.restaurant_id,
      table_id: currentOrder.table_id,
      total_price: totalPrice.toFixed(2),
      customer_lat: resolvedLocation?.lat,
      customer_lng: resolvedLocation?.lng,
      delivery_address: deliveryAddress.trim() || undefined,
      items: currentOrder.items.map((i) => ({
        item_id: i.id,
        comment: i.comment,
        quantity: i.quantity,
        options: i.options.map((opt) => opt.id),
      })),
    };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
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
      const apiError = err?.response?.data;
      const errorCode = apiError?.code;

      if (errorCode === "out_of_delivery_range") {
        toast.error(
          `Outside delivery range (${apiError.distance_km} km / ${apiError.delivery_radius_km} km)`,
        );
      } else if (errorCode === "customer_location_required") {
        toast.error("Please set your location before submitting this order");
      } else {
        toast.error(apiError?.message || "Failed to submit order");
      }

      throw err;
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
        deliveryAddress,
        setDeliveryAddress,
        customerLocation,
        setCustomerLocation,
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
