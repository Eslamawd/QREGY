"use client";
import KitchenManagment from "@/components/kitchen/KitchenManagment";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  // 🔍 استخراج القيم من الـ URL
  const params = useParams();

  const searchParams = useSearchParams();
  const restaurant_id = searchParams.get("restaurant");
  const user_id = searchParams.get("user");
  const token = searchParams.get("token");
  return (
    <KitchenManagment
      kitchen={params.id}
      restaurant_id={restaurant_id}
      user_id={user_id}
      token={token}
    />
  );
}

export default Page;
