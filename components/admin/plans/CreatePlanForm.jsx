// src/components/admin/customization/CreatePlanForm.jsx
"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addNewPlanSub } from "@/lib/planSubApi.js";
import { useLanguage } from "@/context/LanguageContext.jsx";

function CreatePlanForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    max_restaurants: 1,
    max_tables: 1,
    max_items: 1,
    vip_support: false,
    features: [{ title: "", title_ar: "" }],
  });

  const { lang } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", title_ar: "" }],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(lang === "ar" ? "أدخل اسم الخطة" : "Please enter plan name");
      return;
    }

    setIsLoading(true);
    try {
      const res = await addNewPlanSub(formData);
      if (res) {
        toast.success(
          lang === "ar"
            ? "تم إنشاء الخطة بنجاح ✅"
            : "Plan created successfully ✅"
        );
        onSuccess?.(res);
        router.push("/admin/plan-sub");
        onCancel?.();
      }
    } catch {
      toast.error(
        lang === "ar" ? "حدث خطأ أثناء الإنشاء" : "Error creating plan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6  dark:bg-neutral-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-800"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          {lang === "ar" ? "اسم الخطة" : "Plan Name"}
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{lang === "ar" ? "السعر" : "Price"}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_days">
            {lang === "ar" ? "المدة (أيام)" : "Duration (Days)"}
          </Label>
          <Input
            id="duration_days"
            name="duration_days"
            type="number"
            min="1"
            value={formData.duration_days}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{lang === "ar" ? "عدد المطاعم" : "Max Restaurants"}</Label>
          <Input
            name="max_restaurants"
            type="number"
            min="1"
            value={formData.max_restaurants}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>{lang === "ar" ? "عدد الطاولات" : "Max Tables"}</Label>
          <Input
            name="max_tables"
            type="number"
            min="1"
            value={formData.max_tables}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>{lang === "ar" ? "عدد المنتجات" : "Max Items"}</Label>
          <Input
            name="max_items"
            type="number"
            min="1"
            value={formData.max_items}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{lang === "ar" ? "دعم VIP" : "VIP Support"}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={formData.vip_support ? "default" : "outline"}
            onClick={() =>
              setFormData((prev) => ({ ...prev, vip_support: true }))
            }
          >
            {lang === "ar" ? "نعم" : "Yes"}
          </Button>
          <Button
            type="button"
            variant={!formData.vip_support ? "default" : "outline"}
            onClick={() =>
              setFormData((prev) => ({ ...prev, vip_support: false }))
            }
          >
            {lang === "ar" ? "لا" : "No"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>{lang === "ar" ? "المميزات" : "Features"}</Label>
        {formData.features.map((feature, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-2 items-center">
            <Input
              value={feature.title}
              onChange={(e) => handleFeatureChange(i, "title", e.target.value)}
              placeholder={`Feature ${i + 1} (EN)`}
            />
            <Input
              value={feature.title_ar}
              onChange={(e) =>
                handleFeatureChange(i, "title_ar", e.target.value)
              }
              placeholder={`الميزة ${i + 1} (AR)`}
            />
            {formData.features.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeFeature(i)}
              >
                {lang === "ar" ? "إزالة" : "Remove"}
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addFeature}>
          {lang === "ar" ? "إضافة ميزة +" : "+ Add Feature"}
        </Button>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
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
              ? "جاري الحفظ..."
              : "Saving..."
            : lang === "ar"
            ? "إنشاء خطة"
            : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}

export default CreatePlanForm;
