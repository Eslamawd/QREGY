"use client";
import CashierManagment from "@/components/cashier/CashierManagment";
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
    <CashierManagment
      cashier={params.id}
      restaurant_id={restaurant_id}
      user_id={user_id}
      token={token}
    />
  );
}

export default Page;
