"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Download,
  QrCode,
  Edit,
  Eye,
  Trash2,
  Car,
  Globe,
  Star,
  StarIcon,
  MapPin,
  Clock3,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { getRestaurant, linksRestaurant } from "@/lib/restaurantApi";
import api from "@/api/axiosClient";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import CreateMenuForm from "./menus/CreateMenuForm";
import UpdateMenuForm from "./menus/UpdateMenuForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateTableForm from "./table/CreateTableForm";
import UpdateTableForm from "./table/UpdateTableForm";
import { deleteTable } from "@/lib/tableApi";
import { usePathname, useRouter } from "next/navigation";
import {
  FaFacebook,
  FaGoogleDrive,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";

const ServiceAreaMap = dynamic(
  () => import("@/components/location/ServiceAreaMap"),
  {
    ssr: false,
  },
);

/**
 * RestaurantPage — Dark Neon style (glassmorphism + neon gradients)
 * - keeps your logic (getRestaurant, QR download, menus, tables, dialogs)
 * - upgrades visuals & animations
 */

const RestaurantPage = ({ id }) => {
  const { lang } = useLanguage();
  const [restaurant, setRestaurant] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [linksForm, setLinksForm] = useState({
    restaurant_id: "",
    google_review: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isDialogOpenTable, setIsDialogOpenTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const router = useRouter();

  const pathname = usePathname();

  // الصفحات اللي مش عايز فيها Header و Footer
  const hideLayoutRoutes = ["/admin"];
  const shouldHideLayout = hideLayoutRoutes.some((path) =>
    pathname.startsWith(path),
  );

  // Menu handlers
  const handleEditMenu = (rest) => {
    setSelectedMenu(rest);
    setIsNew(false);
    setIsDialogOpen(true);
  };
  const handleAddNewMenu = () => {
    setIsNew(true);
    setSelectedMenu(null);
    setIsDialogOpen(true);
  };

  // Table handlers
  const handleEditTable = (rest) => {
    setSelectedTable(rest);
    setIsNew(false);
    setIsDialogOpenTable(true);
  };
  const handleAddNewTable = () => {
    setIsNew(true);
    setSelectedTable(null);
    setIsDialogOpenTable(true);
  };
  const handleDeleteTable = (table) => {
    setSelectedTable(table);
    setShowDeleteDialog(true);
  };
  const confirmDelete = async () => {
    try {
      await deleteTable(selectedTable.id);
      setTables((prev) => prev.filter((c) => c.id !== selectedTable.id));
      setShowDeleteDialog(false);
      toast.success(
        lang === "ar" ? "تم حذف الطاولة بنجاح" : "Table deleted successfully",
      );
    } catch (err) {
      toast.error(lang === "ar" ? "فشل حذف الطاولة" : "Failed to delete table");
    }
  };

  // 🔹 تحميل بيانات المطعم
  const fetchRestaurant = async () => {
    try {
      const data = await getRestaurant(id);
      setRestaurant(data);
      setMenus(data.menus || []);
      setTables(data.tables || []);
      setLinksForm({
        restaurant_id: data.id || "",
        google_review: data.links?.google_review || "",
        facebook: data.links?.facebook || "",
        instagram: data.links?.instagram || "",
        tiktok: data.links?.tiktok || "",
        website: data.links?.website || "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        lang === "ar"
          ? "فشل في تحميل بيانات المطعم"
          : "Failed to load restaurant",
      );
    }
  };
  useEffect(() => {
    fetchRestaurant();
  }, [id, lang]);

  const normalizeUrl = (url) => {
    if (!url) return null;

    // تصحيح الاستخدام الغلط مثل "https;//"
    url = url
      .replace("://", "___TEMP___")
      .replace(";", ":")
      .replace("___TEMP___", "://");

    // لو مفيش http أو https
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    return url;
  };

  const data = {
    restaurant_id: linksForm.restaurant_id,
    facebook: normalizeUrl(linksForm.facebook),
    instagram: normalizeUrl(linksForm.instagram),
    tiktok: normalizeUrl(linksForm.tiktok),
    website: normalizeUrl(linksForm.website),
    google_review: normalizeUrl(linksForm.google_review),
  };
  // 🔹 تحميل QR لأي نوع (مطعم - مطبخ - كاشير)
  const handleDownloadQR = async (type = "image", model, qrId, tableName) => {
    try {
      const response = await api().get(`api/restaurants/${qrId}/qr/${model}`, {
        responseType: "blob",
      });
      const blob = response.data;

      if (type === "image") {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${model}-${tableName ? tableName : qrId}-QR.png`;
        link.click();
      } else {
        const pdf = new jsPDF();
        const imgData = URL.createObjectURL(blob);
        pdf.text(`${model} #${tableName ? tableName : qrId}`, 10, 10);
        pdf.addImage(imgData, "PNG", 10, 20, 80, 80);
        pdf.save(`${model}-${tableName ? tableName : qrId}-QR.pdf`);
      }

      toast.success(lang === "ar" ? "تم تحميل QR" : "QR downloaded");
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "خطأ في تحميل QR" : "Error downloading QR");
    }
  };

  if (!restaurant)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#03060a] to-[#071025]">
        <div className="text-cyan-300 animate-pulse">Loading restaurant...</div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pb-16  text-white"
    >
      {/* Header */}
      <div className="relative h-64 w-full">
        <img
          src={restaurant.cover}
          alt="cover"
          className="object-cover w-full h-full opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-center">
          <div className="w-36 h-36 rounded-full border-4 border-white/10 shadow-[0_10px_30px_rgba(0,255,255,0.08)] overflow-hidden">
            <img
              src={restaurant.logo}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="mt-24 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400">
          {restaurant.name}
        </h1>
        <p className="mt-2 text-sm text-gray-400">{restaurant.address}</p>
      </div>

      {/* Service location */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#071025]/60 to-[#0b1220]/40 p-5 shadow-lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-cyan-300">
                {lang === "ar"
                  ? "موقع الخدمة ونطاق التوصيل"
                  : "Service location and delivery zone"}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {restaurant.address ||
                  (lang === "ar" ? "لا يوجد عنوان" : "No address provided")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-gray-200">
                <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                {restaurant.latitude && restaurant.longitude
                  ? `${Number(restaurant.latitude).toFixed(6)}, ${Number(restaurant.longitude).toFixed(6)}`
                  : lang === "ar"
                    ? "غير محدد"
                    : "Not set"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-gray-200">
                <Ruler className="h-3.5 w-3.5 text-cyan-300" />
                {lang === "ar"
                  ? `${restaurant.delivery_radius_km || 10} كم نطاق توصيل`
                  : `${restaurant.delivery_radius_km || 10} km delivery radius`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-gray-200">
                <Clock3 className="h-3.5 w-3.5 text-cyan-300" />
                {restaurant.open_time && restaurant.close_time
                  ? `${restaurant.open_time?.slice(0, 5)} - ${restaurant.close_time?.slice(0, 5)}`
                  : lang === "ar"
                    ? "ساعات العمل غير محددة"
                    : "Operating hours not set"}
              </span>
            </div>
          </div>

          {restaurant.latitude && restaurant.longitude ? (
            <ServiceAreaMap
              lat={Number(restaurant.latitude)}
              lng={Number(restaurant.longitude)}
              radiusKm={Number(restaurant.delivery_radius_km || 10)}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm text-gray-400">
              {lang === "ar"
                ? "حدد موقع المطعم من نموذج التعديل لعرض الـ pin ونطاق الخدمة هنا."
                : "Set restaurant coordinates in the edit form to display the pin and service area here."}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kitchens / Cashiers / Restaurant Info Cards */}
          <InfoCardNeon
            title={lang === "ar" ? "المطبخ" : "Kitchen"}
            value={`${restaurant.kitchens?.length || 0} ${
              lang === "ar" ? "مطبخ" : "Kitchen(s)"
            }`}
            qrList={restaurant.kitchens || []}
            model="kitchens"
            handleDownloadQR={handleDownloadQR}
            glow="cyan"
          />
          <InfoCardNeon
            title={lang === "ar" ? "الكاشير" : "Cashier"}
            value={`${restaurant.cashiers?.length || 0} ${
              lang === "ar" ? "كاشير" : "Cashier(s)"
            }`}
            qrList={restaurant.cashiers || []}
            model="cashiers"
            handleDownloadQR={handleDownloadQR}
            glow="violet"
          />
          <InfoCardNeon
            title={lang === "ar" ? "المطعم" : "Restaurant"}
            value={`${restaurant.name}`}
            qrList={[{ id: restaurant.id }]}
            model="restaurants"
            handleDownloadQR={handleDownloadQR}
            glow="teal"
          />

          {/* Orders Card */}
          <div className="col-span-1 lg:col-span-3 bg-gradient-to-br from-[#071025]/60 to-[#0b1220]/40 rounded-2xl p-6 border border-white/6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-cyan-300">
                  {lang === "ar" ? "الطلبات" : "Orders"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/${
                    shouldHideLayout ? "admin" : "dashboard"
                  }/restaurants/${restaurant.id}/orders`}
                >
                  <Button className="bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-700/20">
                    <Car className="mr-2 h-4 w-4 text-cyan-300" />{" "}
                    <span>{lang === "ar" ? "عرض الطلبات" : "View Orders"}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Menus */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {lang === "ar" ? "القوائم" : "Menus"}
            </h2>
            <Button
              onClick={handleAddNewMenu}
              size="sm"
              variant="outline"
              className="border-white/10"
            >
              {lang === "ar" ? "إنشاء القائمة" : "Create Menu"}
            </Button>
          </div>

          {menus.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <motion.div
                  key={menu.id}
                  whileHover={{ translateY: -6 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#071025]/50 to-[#0b1220]/50 border border-white/6 shadow-md"
                >
                  <h3 className="font-semibold text-lg text-white">
                    {lang === "ar" ? menu.name : menu.name_en}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    {menu.categories?.length || 0}{" "}
                    {lang === "ar" ? "تصنيف" : "Categories"}
                  </p>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      onClick={() => handleEditMenu(menu)}
                      size="sm"
                      variant="ghost"
                      className="border-white/6"
                    >
                      <Edit className="h-4 w-4 text-cyan-300" />
                    </Button>
                    <Link href={`/dashboard/menu/${menu.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="border-white/6"
                      >
                        <Eye className="h-4 w-4 text-cyan-300" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">
              {lang === "ar" ? "لا توجد قوائم بعد." : "No menus available yet."}
            </p>
          )}
        </section>

        {/* Tables */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {lang === "ar" ? "الطاولات" : "Tables"}
            </h2>
            <Button
              onClick={handleAddNewTable}
              size="sm"
              variant="outline"
              className="border-white/10"
            >
              {lang === "ar" ? "إضافة طاولة" : "Add Table"}
            </Button>
          </div>

          {tables.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tables.map((table, index) => (
                <motion.div
                  key={`${table.id || "table"}-${index}`}
                  whileHover={{ translateY: -6 }}
                  className="rounded-2xl p-4 bg-gradient-to-br from-[#071025]/50 to-[#0b1220]/50 border border-white/6 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{table.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {table.seats
                          ? `${table.seats} ${
                              lang === "ar" ? "مقاعد" : "seats"
                            }`
                          : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEditTable(table)}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="h-4 w-4 text-emerald-300" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteTable(table)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleDownloadQR(
                            "image",
                            "tables",
                            table.id,
                            table.name,
                          )
                        }
                      >
                        <QrCode className="h-4 w-4 mr-2 text-cyan-300" /> Image
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDownloadQR(
                            "pdf",
                            "tables",
                            table.id,
                            table.name,
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-2 text-cyan-300" /> PDF
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">
              {lang === "ar"
                ? "لا توجد طاولات بعد."
                : "No tables available yet."}
            </p>
          )}
        </section>
        {/* Restaurant Links */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {lang === "ar" ? "روابط المطعم" : "Restaurant Links"}
            </h2>

            <Button
              onClick={() => setShowLinksModal(true)}
              size="sm"
              variant="outline"
              className="border-white/10"
            >
              {lang === "ar" ? "تعديل الروابط" : "Edit Links"}
            </Button>
          </div>

          {restaurant?.links ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Google Review",
                  icon: <FaGoogle className="w-5 h-5 text-red-600" />,
                  field: "google_review",
                },
                {
                  label: "Facebook",
                  icon: <FaFacebook className="w-5 h-5 text-blue-400" />,
                  field: "facebook",
                },
                {
                  label: "Instagram",
                  icon: <FaInstagram className="w-5 h-5 text-pink-400" />,
                  field: "instagram",
                },
                {
                  label: "TikTok",
                  icon: <FaTiktok className="w-5 h-5 text-blue-400" />,
                  field: "tiktok",
                },
                {
                  label: "Website",
                  icon: <Globe className="w-5 h-5 text-green-400" />,
                  field: "website",
                },
              ]
                .filter((item) => restaurant.links[item.field])
                .map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ translateY: -6 }}
                    className="rounded-2xl p-4 bg-gradient-to-br from-[#071025]/50 to-[#0b1220]/50 border border-white/6 shadow-md flex flex-col gap-3"
                  >
                    <h3 className="font-semibold text-white text-lg">
                      {item.icon} {item.label}
                    </h3>

                    <a
                      href={restaurant.links[item.field]}
                      target="_blank"
                      className="text-cyan-300 underline break-all text-sm"
                    >
                      {restaurant.links[item.field]}
                    </a>
                  </motion.div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">
              {lang === "ar"
                ? "لم يتم إضافة روابط بعد."
                : "No links added yet."}
            </p>
          )}
        </section>
      </div>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#071025]/80 to-[#020217]/80 border border-white/8 shadow-2xl backdrop-blur-md text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {isNew
                ? lang === "ar"
                  ? "إضافة القائمة"
                  : "Add Menu"
                : lang === "ar"
                  ? "تعديل القائمة"
                  : "Update Menu"}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? lang === "ar"
                  ? "املأ بيانات القائمة لإنشائها."
                  : "Fill Menu details to create."
                : lang === "ar"
                  ? "قم بتعديل بيانات القائمة ثم احفظ."
                  : "Edit Menu details and save."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreateMenuForm
              id={id}
              onSuccess={(newRest) => {
                setMenus((prev) => [newRest, ...prev]);
                console.log(newRest);

                setIsDialogOpen(false);
                toast.success(
                  lang === "ar" ? "تم إنشاء القائمة" : "Menu created",
                );
                fetchRestaurant();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <UpdateMenuForm
              menu={selectedMenu}
              onSuccess={(updated) => {
                setMenus((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r)),
                );
                setIsDialogOpen(false);
                toast.success(
                  lang === "ar" ? "تم تحديث القائمة" : "Menu updated",
                );
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpenTable} onOpenChange={setIsDialogOpenTable}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#071025]/80 to-[#020217]/80 border border-white/8 shadow-2xl backdrop-blur-md text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {isNew
                ? lang === "ar"
                  ? "إضافة طاولة"
                  : "Add Table"
                : lang === "ar"
                  ? "تعديل الطاولة"
                  : "Update Table"}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? lang === "ar"
                  ? "املأ بيانات الطاولة لإنشائها."
                  : "Fill Table details to create."
                : lang === "ar"
                  ? "قم بتعديل بيانات الطاولة ثم احفظ."
                  : "Edit Table details and save."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreateTableForm
              id={id}
              onSuccess={(newTable) => {
                setTables((prev) => [newTable, ...prev]);
                setIsDialogOpenTable(false);
                toast.success(
                  lang === "ar" ? "تم إضافة الطاولة" : "Table added",
                );
              }}
              onCancel={() => setIsDialogOpenTable(false)}
            />
          ) : (
            <UpdateTableForm
              table={selectedTable}
              onSuccess={(updatedTable) => {
                setTables((prev) =>
                  prev.map((t) =>
                    t.id === updatedTable.id ? updatedTable : t,
                  ),
                );
                setIsDialogOpenTable(false);
                toast.success(
                  lang === "ar" ? "تم تحديث الطاولة" : "Table updated",
                );
              }}
              onCancel={() => setIsDialogOpenTable(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showLinksModal} onOpenChange={setShowLinksModal}>
        <DialogContent className="max-w-xl bg-gradient-to-b from-[#071025]/80 to-[#020217]/80 border border-white/8 shadow-2xl backdrop-blur-md text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {lang === "ar" ? "تعديل روابط المطعم" : "Edit Restaurant Links"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "قم بتعديل روابط السوشيال و Google Review."
                : "Modify social media & Google Review links."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {[
              { key: "google_review", label: "Google Review" },
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
              { key: "tiktok", label: "TikTok" },
              { key: "website", label: "Website" },
            ].map((item) => (
              <div key={item.key} className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">{item.label}</label>
                <input
                  type="text"
                  value={linksForm[item.key]}
                  onChange={(e) =>
                    setLinksForm({ ...linksForm, [item.key]: e.target.value })
                  }
                  className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-white"
                />
              </div>
            ))}

            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              onClick={async () => {
                try {
                  const response = await linksRestaurant(data);

                  toast.success(
                    lang === "ar" ? "تم تحديث الروابط" : "Links updated",
                  );

                  setShowLinksModal(false);
                  setRestaurant((prev) => ({
                    ...prev,
                    links: response.links,
                  }));
                } catch (err) {
                  console.error(err);
                  toast.error(
                    lang === "ar" ? "حدث خطأ" : "Error updating links",
                  );
                }
              }}
            >
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-b from-[#071025]/90 to-[#020217]/90 border border-white/8 shadow-2xl backdrop-blur-md text-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar"
                ? "سيتم حذف هذه الطاولة."
                : "This will delete the table."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white"
            >
              {lang === "ar" ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

/* ---------- Neon InfoCard component ---------- */
const InfoCardNeon = ({
  title,
  value,
  qrList = [],
  model,
  handleDownloadQR,
  glow = "cyan",
}) => {
  // glow: "cyan" | "violet" | "teal"
  const glowClasses =
    glow === "cyan"
      ? "from-cyan-600/30 to-blue-700/10 ring-cyan-400/30"
      : glow === "violet"
        ? "from-fuchsia-600/30 to-pink-600/10 ring-fuchsia-400/30"
        : "from-emerald-600/30 to-cyan-600/10 ring-emerald-400/30";

  return (
    <motion.div
      whileHover={{ translateY: -6 }}
      className={`p-6 rounded-2xl ${glowClasses} backdrop-blur-md border border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.6)]`}
    >
      <h4 className="text-sm uppercase tracking-wide text-gray-200">{title}</h4>
      <p className="text-lg font-semibold text-white mt-2">{value}</p>

      {qrList.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          {qrList.map((item, index) => (
            <div key={item.id || index} className="flex justify-center gap-3">
              <Button
                size="sm"
                onClick={() => handleDownloadQR("image", model, item.id)}
                className="bg-white/5 hover:bg-white/8 border border-white/6"
              >
                <QrCode className="mr-2 h-4 w-4 text-cyan-300" /> {/** Image */}
                <span className="text-sm">{/* keep label simple */}Image</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadQR("pdf", model, item.id)}
                className="border-white/6"
              >
                <Download className="mr-2 h-4 w-4 text-cyan-300" />{" "}
                <span className="text-sm">PDF</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RestaurantPage;
