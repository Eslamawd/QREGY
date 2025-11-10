"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getRestaurantWithUser } from "@/lib/restaurantApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Phone, Flame, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MenuHeader } from "../layout/MenuHeader";
import AddToOrderButton from "./AddToOrderButton";
import { useCurrency } from "@/context/CurrencyContext";

const MenuShowCategory = ({ table_id, restaurant_id, user_id, token }) => {
  const { lang } = useLanguage();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { formatPrice } = useCurrency();
  const isArabic = lang === "ar";
  const t = (ar, en) => (isArabic ? ar : en);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRestaurantWithUser(restaurant_id, user_id, token);
        if (res?.active === false) {
          toast.error("⚠️ انتهى اشتراك المطعم، يرجى التجديد للاستمرار.");
          return;
        }
        setRestaurant(res);
      } catch (err) {
        console.error(err);
        toast.error(
          t("فشل تحميل بيانات المطعم", "Failed to load restaurant data")
        );
      }
    };
    fetchData();
  }, [restaurant_id, user_id, token]);

  if (!restaurant) return null;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen relative" // تم التعديل
    >
            {/* 🛑 الخلفية الثابتة والكاملة (التعديل الأساسي) */}
           {" "}
      <div
        style={{ backgroundImage: `url(${restaurant.cover})` }}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-fixed"
      />
            {/* طبقة التعتيم لجعل النص مقروءاً فوق الخلفية */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" />   
        {/* ⬇️ كل محتوى الصفحة يكون داخل هذه الحاوية مع z-10 ⬇️ */}     {" "}
      <div className="relative z-10">
                {/* Header */}
               {" "}
        <MenuHeader
          logo={restaurant?.logo}
          restaurant_id={restaurant_id}
          user_id={user_id}
          token={token}
        />
               {" "}
        {/* قسم معلومات المطعم فوق الخلفية الثابتة - بديل Cover Section */}     
         {" "}
        <div className="w-full pt-16 pb-10 shadow-2xl bg-black/30 rounded-b-xl border-b border-white/10">
                   {" "}
          <div className="relative flex flex-col items-center justify-center h-full text-center px-4">
                       {" "}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold font-cairo text-white drop-shadow-xl"
            >
                            {restaurant.name}           {" "}
            </motion.h1>
                       {" "}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap justify-center gap-6 text-gray-100 text-sm md:text-base font-cairo"
            >
                           {" "}
              <span className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-emerald-400" />{" "}
                                {restaurant.address}             {" "}
              </span>
                           {" "}
              <span className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-emerald-400" />{" "}
                {restaurant.phone}             {" "}
              </span>
                         {" "}
            </motion.div>
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Menus List */}       {" "}
        <div className="max-w-6xl mx-auto px-4 py-10">
                   {" "}
          <h2 className="text-2xl font-bold text-center mb-6 font-cairo text-white drop-shadow-lg">
                        {t("القوائم المتاحة", "Available Menus")}         {" "}
          </h2>
                   {" "}
          <div className="flex flex-wrap justify-center gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-sm">
            {" "}
            {/* تم التعديل */}           {" "}
            {restaurant.menus.map((menu) => (
              <motion.button
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                whileHover={{ scale: 1.05 }}
                className="bg-white px-6 py-3 rounded-full shadow-md border font-cairo font-semibold hover:bg-primary hover:text-white transition"
              >
                                {isArabic ? menu.name : menu.name_en}           
                 {" "}
              </motion.button>
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Modal for selected menu */}       {" "}
        <AnimatePresence>
                   {" "}
          {selectedMenu && (
            <>
                           {" "}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMenu(null)}
              />
                           {" "}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                               {" "}
                <div className="rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] overflow-y-auto relative bg-black/90 text-white backdrop-blur-md">
                  {" "}
                  {/* تم التعديل */}                 {" "}
                  <button
                    onClick={() => setSelectedMenu(null)}
                    className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-50"
                  >
                                        <X className="w-5 h-5" />               
                     {" "}
                  </button>
                                   {" "}
                  <div className="p-6">
                                       {" "}
                    <h2 className="text-2xl font-bold font-cairo mb-6 text-center">
                                           {" "}
                      {isArabic ? selectedMenu.name : selectedMenu.name_en}     
                                   {" "}
                    </h2>
                                       {" "}
                    {selectedMenu.categories.length > 0 ? (
                      selectedMenu.categories.map((cat) => (
                        <div key={cat.id} className="mb-10">
                                                   {" "}
                          <h3 className="text-xl font-bold font-cairo mb-4 border-b pb-2">
                                                       {" "}
                            {isArabic ? cat.name : cat.name_en}                 
                                   {" "}
                          </h3>
                                                   {" "}
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                       {" "}
                            {cat.items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                className="group bg-card/80 border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2" // تم تعديل الخلفية
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                              >
                                                               {" "}
                                <div className="relative h-48 overflow-hidden">
                                                                   {" "}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                                                   {" "}
                                  <div className="absolute top-3 left-3 flex gap-2">
                                                                       {" "}
                                    {item.old_price && (
                                      <Badge className="bg-secondary text-secondary-foreground font-cairo font-semibold">
                                                                               {" "}
                                        {t("عرض خاص", "Special Offer")}         
                                                                   {" "}
                                      </Badge>
                                    )}
                                                                       {" "}
                                    {item.isSpicy && (
                                      <Badge
                                        variant="destructive"
                                        className="font-cairo font-semibold"
                                      >
                                                                               {" "}
                                        <Flame className="h-3 w-3 ml-1" />      
                                                                         {" "}
                                        {t("حار", "Spicy")}                     
                                                       {" "}
                                      </Badge>
                                    )}
                                                                     {" "}
                                  </div>
                                                                 {" "}
                                </div>
                                                               {" "}
                                <div className="p-5 space-y-3">
                                                                   {" "}
                                  <h4 className="font-bold text-lg font-cairo mb-1">
                                                                       {" "}
                                    {isArabic ? item.name : item.name_en}       
                                                             {" "}
                                  </h4>
                                                                   {" "}
                                  <p className="text-sm text-muted-foreground font-cairo line-clamp-2">
                                                                       {" "}
                                    {isArabic
                                      ? item.description
                                      : item.description_en}
                                                                     {" "}
                                  </p>
                                                                   {" "}
                                  {/* ✅ Prices */}                             
                                     {" "}
                                  <div className="flex items-center gap-2 pt-2">
                                                                       {" "}
                                    <span className="text-xl font-bold text-primary font-cairo">
                                                                           {" "}
                                      {formatPrice(Number(item.price))}         
                                                               {" "}
                                    </span>
                                                                       {" "}
                                    {item.old_price && (
                                      <span className="text-sm text-muted-foreground line-through">
                                                                               {" "}
                                        {formatPrice(Number(item.old_price))}   
                                                                         {" "}
                                      </span>
                                    )}
                                                                     {" "}
                                  </div>
                                                                   {" "}
                                  <AddToOrderButton
                                    table_id={table_id}
                                    item={item}
                                    restaurant_id={restaurant_id}
                                    lang={lang}
                                  />
                                                                   {" "}
                                  {/* ✅ Options */}                           
                                       {" "}
                                  {item.options?.length > 0 && (
                                    <div className="pt-2">
                                                                           {" "}
                                      <h4 className="text-sm font-cairo font-semibold mb-1">
                                                                               {" "}
                                        {t("الاختيارات:", "Options:")}         
                                                                   {" "}
                                      </h4>
                                                                           {" "}
                                      <div className="flex flex-wrap gap-2">
                                                                               {" "}
                                        {item.options.map((opt) => (
                                          <Badge
                                            key={opt.id}
                                            variant="outline"
                                            className="font-cairo text-sm"
                                          >
                                                                               
                                                   {" "}
                                            {isArabic ? opt.name : opt.name_en}{" "}
                                            +                                  
                                                     {" "}
                                            {formatPrice(Number(opt.price))}   
                                                                               
                                             {" "}
                                          </Badge>
                                        ))}
                                                                             {" "}
                                      </div>
                                                                         {" "}
                                    </div>
                                  )}
                                                                 {" "}
                                </div>
                                                             {" "}
                              </motion.div>
                            ))}
                                                     {" "}
                          </div>
                                                 {" "}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground font-cairo text-lg py-10">
                                               {" "}
                        {t(
                          "لا توجد تصنيفات حالياً في هذه القائمة",
                          "No categories currently in this menu"
                        )}
                                             {" "}
                      </p>
                    )}
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </motion.div>
                         {" "}
            </>
          )}
                 {" "}
        </AnimatePresence>
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default MenuShowCategory;
