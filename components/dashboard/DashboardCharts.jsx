"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Building2, Briefcase, Sparkles, Users } from "lucide-react";

const COLORS = ["#fb7185", "#f97316", "#22d3ee", "#14b8a6", "#8b5cf6"];

export default function DashboardCharts({
  lang,
  formatPrice,
  restaurantsCount,
  ordersCount,
  totalRevenue,
  ordersByRestaurant,
  monthlyRevenue,
  topRestaurants,
}) {
  const cards = [
    {
      id: 1,
      title: lang === "ar" ? "عدد المطاعم" : "Restaurants",
      icon: <Building2 className="h-5 w-5 text-cyan-300" />,
      value: restaurantsCount,
      desc:
        lang === "ar"
          ? "المواقع النشطة الجاهزة لاستقبال الطلبات"
          : "Active locations ready for orders",
      accent: "from-cyan-500/25 via-sky-400/15 to-transparent",
    },
    {
      id: 2,
      title: lang === "ar" ? "عدد الطلبات" : "Orders",
      icon: <Briefcase className="h-5 w-5 text-orange-300" />,
      value: ordersCount,
      desc:
        lang === "ar"
          ? "إجمالي الطلبات التي تم تتبعها على المنصة"
          : "Tracked orders across the platform",
      accent: "from-orange-500/25 via-rose-400/15 to-transparent",
    },
    {
      id: 3,
      title: lang === "ar" ? "إجمالي الإيرادات" : "Revenue",
      icon: <Users className="h-5 w-5 text-emerald-300" />,
      value: formatPrice(totalRevenue),
      desc:
        lang === "ar"
          ? "صافي المبيعات الظاهرة في لوحة التحكم"
          : "Visible sales performance in the dashboard",
      accent: "from-emerald-500/25 via-teal-400/15 to-transparent",
    },
    {
      id: 4,
      title: lang === "ar" ? "جاهزية التشغيل" : "Ops Readiness",
      icon: <Sparkles className="h-5 w-5 text-violet-300" />,
      value: lang === "ar" ? "مباشر" : "Live",
      desc:
        lang === "ar"
          ? "ثيم موحّد وحركة خفيفة وتحميل محسن"
          : "Unified theme, motion, and lighter initial load",
      accent: "from-violet-500/25 via-fuchsia-400/15 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/70 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_22px_80px_rgba(2,8,23,0.45)]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.accent}`}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300/80">
                  {card.title}
                </p>
                <p className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  {card.value}
                </p>
                <p className="max-w-[22rem] text-sm leading-6 text-slate-600 dark:text-slate-300/80">
                  {card.desc}
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard
          title={lang === "ar" ? "الطلبات لكل مطعم" : "Orders per Restaurant"}
        >
          <BarChart data={ordersByRestaurant}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.18)"
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="orders" fill="#22d3ee" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard
          title={lang === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}
        >
          <LineChart data={monthlyRevenue}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.18)"
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fb7185" }}
            />
          </LineChart>
        </ChartCard>

        <ChartCard
          title={
            lang === "ar"
              ? "أفضل 5 مطاعم حسب الإيرادات"
              : "Top 5 Restaurants by Revenue"
          }
        >
          <PieChart>
            <Pie
              data={topRestaurants}
              dataKey="revenue"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
            >
              {topRestaurants.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[28px] border border-slate-200/80 bg-white/75 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8 dark:shadow-[0_22px_80px_rgba(2,8,23,0.45)]"
    >
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.92)",
  color: "#fff",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "16px",
};
