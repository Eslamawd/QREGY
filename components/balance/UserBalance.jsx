"use client";
import React, { useState, useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getBalanceUser } from "../../lib/walletApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

const UserBalance = () => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalanceUpdated, setShowBalanceUpdated] = useState(false);

  const { formatPrice } = useCurrency();
  const router = useRouter();

  // Fetch user balance
  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const response = await getBalanceUser(user.id);
      const safeBalance = Math.max(0, response.balance || 0);

      if (prevBalance !== null && safeBalance !== prevBalance) {
        setShowBalanceUpdated(true);
        setPrevBalance(userBalance);

        // Show low balance warning toast
        if (safeBalance < 10) {
          toast.warning("Your balance is low", {
            description: "Please add funds to continue making purchases.",
          });
        }

        // Hide the balance update message after 3 seconds
        setTimeout(() => setShowBalanceUpdated(false), 3000);
      }

      setUserBalance(safeBalance);
      if (prevBalance === null) setPrevBalance(safeBalance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      toast.error("Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchUserBalance();

    const intervalId = setInterval(fetchUserBalance, 30 * 60 * 100); // 30 min

    const handlePurchaseEvent = () => fetchUserBalance();
    const handleInsufficientFundsEvent = () => {
      toast.error("Insufficient balance", {
        description: "Please add funds to your account",
      });
      router.push("/dashboard/payment");
    };

    window.addEventListener("purchase-completed", handlePurchaseEvent);
    window.addEventListener("insufficient-funds", handleInsufficientFundsEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("purchase-completed", handlePurchaseEvent);
      window.removeEventListener(
        "insufficient-funds",
        handleInsufficientFundsEvent
      );
    };
  }, [user]);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  }

  const balanceChange = prevBalance !== null ? userBalance - prevBalance : 0;
  const isPositiveChange = balanceChange > 0;

  return (
    <div className="relative flex items-center mr-2">
      {/* رسالة زيادة/نقصان الرصيد */}
      <AnimatePresence>
        {showBalanceUpdated && balanceChange !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -bottom-12 right-0 px-4 z-60 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-md border ${
              isPositiveChange
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            Balance {isPositiveChange ? "increased" : "decreased"} by{" "}
            {formatPrice(Math.abs(balanceChange))}
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <Link
          href="/dashboard/payment"
          className="relative flex items-center rounded-full border border-gray-400 px-4 py-2 hover:bg-blue-950 hover:text-white transition-colors"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          <span>{formatPrice(userBalance)}</span>

          {/* badge الرصيد المنخفض */}
          {userBalance < 10 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow"
            >
              Low
            </motion.span>
          )}
        </Link>
      )}
    </div>
  );
};

export default UserBalance;
