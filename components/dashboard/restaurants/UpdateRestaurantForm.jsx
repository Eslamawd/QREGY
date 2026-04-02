"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Separator } from "../../ui/Separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { updateRestaurant } from "@/lib/restaurantApi";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const LocationPicker = dynamic(
  () => import("@/components/location/LocationPicker"),
  {
    ssr: false,
  },
);

function UpdateRestaurantForm({ restaurant, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || "",
    type: restaurant?.type || "restaurant",
    phone: restaurant?.phone || "",
    address: restaurant?.address || "",
    latitude: restaurant?.latitude ? String(restaurant.latitude) : "",
    longitude: restaurant?.longitude ? String(restaurant.longitude) : "",
    delivery_radius_km: restaurant?.delivery_radius_km
      ? String(restaurant.delivery_radius_km)
      : "10",
    open_time: restaurant?.open_time
      ? String(restaurant.open_time).slice(0, 5)
      : "09:00",
    close_time: restaurant?.close_time
      ? String(restaurant.close_time).slice(0, 5)
      : "23:00",
    logo: null,
    cover: null,
  });

  const [preview, setPreview] = useState({
    logo: restaurant?.logo || "",
    cover: restaurant?.cover || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(
    restaurant?.latitude && restaurant?.longitude
      ? {
          lat: restaurant.latitude,
          lng: restaurant.longitude,
          address: restaurant.address,
          isSet: true,
        }
      : null,
  );
  const { lang } = useLanguage();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationChange = (nextLocation) => {
    setLocation(nextLocation);
    setFormData((prev) => ({
      ...prev,
      address: nextLocation?.address || prev.address,
      latitude: nextLocation?.lat ? String(nextLocation.lat) : "",
      longitude: nextLocation?.lng ? String(nextLocation.lng) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error(
        lang === "ar"
          ? "الرجاء إدخال جميع الحقول المطلوبة"
          : "Please fill all required fields",
      );
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("_method", "PATCH");

    // فقط ضيف الحقول اللي فيها قيمة
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataObj.append(key, value);
      }
    });

    setIsLoading(true);
    try {
      const res = await updateRestaurant(restaurant.id, formDataObj);
      if (res) {
        toast.success(
          lang === "ar"
            ? "تم تحديث بيانات المطعم بنجاح ✅"
            : "Restaurant updated successfully ✅",
        );
        onSuccess?.(res);
        onCancel?.();
        router.refresh();
      }
    } catch (err) {
      console.error("Error updating restaurant:", err);
      toast.error(
        lang === "ar"
          ? "حدث خطأ أثناء تحديث المطعم"
          : "Failed to update restaurant",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6  rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            {lang === "ar" ? "اسم المطعم" : "Restaurant Name"}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={
              lang === "ar" ? "أدخل اسم المطعم" : "Enter restaurant name"
            }
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">{lang === "ar" ? "النوع" : "Type"}</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="restaurant">
              {lang === "ar" ? "مطعم" : "Restaurant"}
            </option>
            <option value="coffee">
              {lang === "ar" ? "كوفي شوب" : "Coffee Shop"}
            </option>
          </select>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            {lang === "ar" ? "رقم الهاتف" : "Phone"}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder={
              lang === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"
            }
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">
            {lang === "ar" ? "العنوان" : "Address"}
          </Label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder={
              lang === "ar" ? "أدخل عنوان المطعم" : "Enter restaurant address"
            }
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_radius_km">
            {lang === "ar" ? "نطاق التوصيل بالكيلومتر" : "Delivery radius (km)"}
          </Label>
          <Input
            id="delivery_radius_km"
            name="delivery_radius_km"
            type="number"
            min="1"
            max="100"
            step="0.5"
            value={formData.delivery_radius_km}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="open_time">
            {lang === "ar" ? "يفتح الساعة" : "Opens at"}
          </Label>
          <Input
            id="open_time"
            name="open_time"
            type="time"
            value={formData.open_time}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="close_time">
            {lang === "ar" ? "يغلق الساعة" : "Closes at"}
          </Label>
          <Input
            id="close_time"
            name="close_time"
            type="time"
            value={formData.close_time}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>
            {lang === "ar" ? "إحداثيات المطعم" : "Restaurant coordinates"}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Input value={formData.latitude} readOnly placeholder="Latitude" />
            <Input
              value={formData.longitude}
              readOnly
              placeholder="Longitude"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-black/10 p-4">
        <div>
          <h3 className="text-sm font-semibold">
            {lang === "ar"
              ? "عدّل موقع المطعم على الخريطة"
              : "Update restaurant location on the map"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {lang === "ar"
              ? "سيظهر مطعمك للعميل القريب بناءً على هذه الإحداثيات."
              : "Your restaurant will be shown to nearby customers using these coordinates."}
          </p>
        </div>
        <LocationPicker value={location} onChange={handleLocationChange} />
      </div>

      <Separator />

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">
          {lang === "ar" ? "شعار المطعم" : "Restaurant Logo"}
        </Label>
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview.logo && (
          <div className="mt-3">
            <Image
              src={preview.logo}
              alt="Logo preview"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Cover Upload */}
      <div className="space-y-2">
        <Label htmlFor="cover">
          {lang === "ar" ? "صورة الغلاف" : "Cover Image"}
        </Label>
        <Input
          id="cover"
          name="cover"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview.cover && (
          <div className="mt-3">
            <Image
              src={preview.cover}
              alt="Cover preview"
              width={200}
              height={120}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {lang === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? lang === "ar"
              ? "جارٍ الحفظ..."
              : "Saving..."
            : lang === "ar"
              ? "تحديث المطعم"
              : "Update Restaurant"}
        </Button>
      </div>
    </motion.form>
  );
}

export default UpdateRestaurantForm;
