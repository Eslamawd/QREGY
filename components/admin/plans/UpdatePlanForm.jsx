// src/components/admin/customization/UpdatePlanForm.jsx
"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updatePlanSub } from "@/lib/planSubApi.js";
import { useLanguage } from "@/context/LanguageContext.jsx";

function UpdatePlanForm({ plan, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: plan.name || "",
    price: plan.price || 0,
    duration_days: plan.duration_days || 0,
    max_restaurants: plan.max_restaurants || 1,
    max_tables: plan.max_tables || 1,
    max_items: plan.max_items || 1,
    vip_support: plan.vip_support || false,
    features: plan.features?.length
      ? plan.features
      : [{ title: "", title_ar: "" }],
  });
  const { lang } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", title_ar: "" }],
    }));
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a valid plan name");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updatePlanSub(plan.id, formData);
      if (res) {
        toast.success("تم تحديث الخطة بنجاح ✅");
        onSuccess && onSuccess(res);
        router.push("/admin/plan-sub");
        onCancel && onCancel();
      }
    } catch (err) {
      console.error("Error updating plan:", err);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow">
      {/* Plan Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {lang === "ar" ? "اسم الخطة" : "Plan Name"}
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Example: Premium Plan"
          required
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price"> {lang === "ar" ? "سعر الخطة" : "Price"} </Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      {/* Duration Days */}
      <div className="space-y-2">
        <Label htmlFor="duration_days">
          {" "}
          {lang === "ar" ? "المدة (أيام)" : "Duration (Days)"}
        </Label>
        <Input
          id="duration_days"
          name="duration_days"
          type="number"
          value={formData.duration_days}
          onChange={handleInputChange}
          min="1"
          required
        />
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

      {/* Features */}
      <div className="space-y-4">
        <Label> {lang === "ar" ? "المميزات " : "Features"}</Label>
        {formData.features.map((feature, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center"
          >
            <Input
              type="text"
              value={feature.title}
              onChange={(e) =>
                handleFeatureChange(index, "title", e.target.value)
              }
              placeholder={`Feature ${index + 1} (EN)`}
              required
            />
            <Input
              type="text"
              value={feature.title_ar}
              onChange={(e) =>
                handleFeatureChange(index, "title_ar", e.target.value)
              }
              placeholder={`الميزة ${index + 1} (AR)`}
              required
            />
            {formData.features.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeFeature(index)}
              >
                {lang === "ar" ? "إزالة" : "Remove"}
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addFeature}>
          {lang === "ar" ? "إضافة ميزة+" : "+ Add Feature"}
        </Button>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {lang === "ar" ? "إلغاء " : "Cancel"}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? lang === "ar"
              ? "حفظ ..."
              : "Saving..."
            : lang === "ar"
            ? "تحديث الخطة"
            : "Update Plan"}
        </Button>
      </div>
    </form>
  );
}

export default UpdatePlanForm;
