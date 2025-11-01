"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import Pagination from "../layout/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { useLanguage } from "@/context/LanguageContext";
import { deletePlanSub, loadPlanSubByAdmin } from "@/lib/planSubApi";
import UpdatePlanForm from "./plans/UpdatePlanForm";
import CreatePlanForm from "./plans/CreatePlanForm";
import { useCurrency } from "@/context/CurrencyContext";

const PlanSubManagement = () => {
  const [plansubs, setPlansubs] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { lang } = useLanguage();
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // جلب الخطط من Laravel API
  const fetchPlanSubs = async () => {
    try {
      const response = await loadPlanSubByAdmin(currentPage);
      setPlansubs(response || []);

      if (response?.length === 0) {
        toast.info(lang === "ar" ? "لا يوجد خطط" : "No plans available");
      }
    } catch (error) {
      console.error("فشل في جلب الخطط ", error);
      toast.error("خطأ في تحميل البيانات");
    }
  };

  useEffect(() => {
    fetchPlanSubs();
  }, [currentPage]);

  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;
    try {
      await deletePlanSub(selectedPlan.id);
      const updatedPlansubs = plansubs.filter((u) => u.id !== selectedPlan.id);
      setPlansubs(updatedPlansubs);
      setShowDeleteDialog(false);
      toast.success(
        lang === "ar"
          ? `تم حذف ${selectedPlan.name} بنجاح`
          : `${selectedPlan.name} deleted successfully`
      );
      setSelectedPlan(null);
    } catch (error) {
      console.error("فشل حذف الخطة ", error);
      toast.error("فشل حذف الخطة");
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsNew(false);
    setIsUpdate(true);
    setIsDialogOpen(true);
  };

  const handleAddNewPlan = () => {
    setIsNew(true);
    setIsUpdate(false);
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className=""
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            {lang === "ar" ? "إدارة الخطط" : "Plans Management"}
          </CardTitle>
          <Button onClick={handleAddNewPlan}>
            + {lang === "ar" ? "إضافة " : "Add New"}
          </Button>
        </CardHeader>
        <CardContent>
          {plansubs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">
                {lang === "ar" ? "لا يوجد خطط" : "No plans available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
              {plansubs.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-white/10 shadow-2xl backdrop-blur-md  text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New Plan" : "Update Plan"}</DialogTitle>
            <DialogDescription>
              {isNew
                ? "Fill in the details to create a new plan."
                : "Edit the plan details."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreatePlanForm
              onSuccess={(newPlan) => {
                setPlansubs((prev) => [...prev, newPlan]);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <UpdatePlanForm
              plan={selectedPlan}
              onSuccess={(updatedPlan) => {
                setPlansubs((prev) =>
                  prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
                );
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-white/10 shadow-2xl backdrop-blur-md ">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "ar"
                ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الخطة بشكل دائم."
                : "This action cannot be undone. The plan will be deleted permanently."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-300 text-destructive-foreground"
            >
              {lang === "ar" ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

const SubscriptionCard = ({ plan, onEdit, onDelete }) => {
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative cursor-pointer rounded-xl p-6 md:p-8 shadow-lg "
    >
      {/* العنوان */}
      <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
        {lang === "ar" ? plan.name : plan.name_en}
      </h3>

      {/* السعر */}
      <p className="text-3xl md:text-4xl font-bold text-white mb-2">
        {formatPrice(plan.price)}
      </p>

      {/* المدة */}
      <p className="text-sm text-gray-400 mb-4">
        {lang === "ar"
          ? `${plan.duration_days} يوم`
          : `${plan.duration_days} days`}
      </p>

      {/* المزايا */}
      <ul className="text-gray-300 space-y-2 mb-4">
        {plan?.features.map((feature, index) => (
          <li key={index}>
            {lang === "ar" ? `• ${feature.title_ar}` : `• ${feature.title}`}
          </li>
        ))}
      </ul>

      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(plan)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanSubManagement;
