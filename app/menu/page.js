"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import NearbyRestaurantsExplorer from "@/components/menu/NearbyRestaurantsExplorer";
import MenuShowCategory from "@/components/menu/MenuShowCategory";

function Page() {
  const searchParams = useSearchParams();

  // 🔍 استخراج القيم من الـ URL
  const restaurant_id = searchParams.get("restaurant");
  const table_id = searchParams.get("table");
  const user_id = searchParams.get("user");
  const token = searchParams.get("token");

  // إذا لم يتم تمرير مطعم، اعرض شاشة المطاعم القريبة
  if (!restaurant_id || !user_id || !token) {
    return <NearbyRestaurantsExplorer />;
  }

  // ✅ تمرير البيانات للمكوّن الرئيسي
  return (
    <MenuShowCategory
      restaurant_id={restaurant_id}
      table_id={table_id}
      user_id={user_id}
      token={token}
    />
  );
}

export default Page;
