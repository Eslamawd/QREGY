"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { addNewMenu } from "@/lib/menuApi";
import { useLanguage } from "@/context/LanguageContext";

function CreateMenuForm({ onSuccess, onCancel, id }) {
  const [formData, setFormData] = useState({
    name: "",
    restaurant_id: id,
    image: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(
        lang === "ar"
          ? "الرجاء إدخال جميع الحقول المطلوبة"
          : "Please fill all required fields",
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await addNewMenu(formData);
      if (res) {
        toast.success(
          lang === "ar"
            ? "تم إنشاء القائمة بنجاح ✅"
            : "Menu created successfully ✅",
        );
        onSuccess && onSuccess(res);
        onCancel && onCancel();
        router.refresh();
      }
    } catch (err) {
      console.error("Error creating Menu:", err);
      toast.error(
        lang === "ar"
          ? "حدث خطأ أثناء إنشاء القائمة"
          : "Failed to create restaurant",
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
      className="space-y-6 p-6 rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            {lang === "ar" ? "اسم القائمة" : "Menu Name"}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={lang === "ar" ? "أدخل اسم القائمة" : "Enter Menu name"}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">
            {lang === "ar" ? "صورة المنيو" : "Menu Image"}
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage ? (
            <img
              src={previewImage}
              alt="menu preview"
              className="h-24 w-full rounded-lg object-cover border border-border"
            />
          ) : null}
        </div>
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
              ? "إنشاء القائمة"
              : "Create Menu"}
        </Button>
      </div>
    </motion.form>
  );
}

export default CreateMenuForm;
