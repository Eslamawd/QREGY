import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

import { Loader2, SubtitlesIcon, DollarSign } from "lucide-react";
import {
  getAllSubCount,
  getRevnueSub,
  getsubscribeByAdmin,
} from "@/lib/subscriptionApi";
import { toast } from "sonner";
import Pagination from "../layout/Pagination";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [totalSub, setTotalSub] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { lang } = useLanguage();

  const { formatPrice } = useCurrency();

  // Function to fetch subscriptions data
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await getsubscribeByAdmin(currentPage);

      setSubscriptions(res.subscriptions.data);
      setCurrentPage(res.subscriptions.current_page);
      setLastPage(res.subscriptions.last_page);
      setTotal(res.subscriptions.total);
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
      toast.error("Failed to load subscriptions."); // Added toast error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [SubCount, revenueResponse] = await Promise.all([
          getAllSubCount(),
          getRevnueSub(),
        ]);

        if (SubCount && SubCount.count >= 0) {
          setTotalSub(SubCount.count);
        } else {
          setTotalSub(0);
          toast.error("No users found");
        }

        if (revenueResponse && revenueResponse.revenue >= 0) {
          setRevenue(revenueResponse.revenue);
        } else {
          setRevenue(0);
          toast.error("No revenue data found");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Something went wrong while fetching dashboard data."); // Added toast error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className=" text-gray-200"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {lang === "ar" ? "إدارة الاشتراكات" : "Subscriptions Management"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <SubtitlesIcon className="h-4 w-4 text-muted-foreground" />
              {lang === "ar" ? "  إجمالي الاشتراكات " : "Total Subscription"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <motion.div
                className="text-2xl font-bold"
                key={totalSub}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {totalSub.toLocaleString()}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {lang === "ar" ? "ربح" : "Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded">
                <Loader2 className="w12 h-12" />
              </div>
            ) : (
              <motion.div
                className="text-2xl font-bold"
                key={revenue}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(revenue)}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {subscriptions.length === 0 ? (
        <p>You have no subscriptions yet.</p>
      ) : (
        <>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mail&Phone</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <React.Fragment key={sub.id}>
                  <TableRow>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>
                      {sub.user.email} {sub.user.phone}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          Date.now() >= new Date(sub.end_date).getTime()
                            ? "text-red-600" // انتهى الاشتراك
                            : Date.now() >= new Date(sub.start_date).getTime()
                            ? "text-green-600" // نشط الآن
                            : "text-yellow-600" // لم يبدأ بعد
                        }
                      >
                        {Date.now() >= new Date(sub.end_date).getTime()
                          ? "Expired"
                          : Date.now() >= new Date(sub.start_date).getTime()
                          ? "Active"
                          : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            label={lang === "ar" ? "الاشتراكات" : "Subscriptions"}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          />
        </>
      )}
    </motion.div>
  );
};

export default SubscriptionsManagement;
