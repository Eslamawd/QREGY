"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/textarea";

export default function AddToOrderButton({
  item,
  lang,
  restaurant_id,
  setSelectedMenu,
  table_id,
}) {
  const { addToOrder, setRestaurantId, setTableId } = useOrder();
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ✅ تحديث تلقائي للسعر الإجمالي
  const totalPrice = useMemo(() => {
    const optionsTotal = selectedOptions.reduce(
      (sum, opt) => sum + Number(opt.price || 0),
      0,
    );
    return (Number(item.price) + optionsTotal) * quantity;
  }, [selectedOptions, item.price, quantity]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      if (prev.find((opt) => opt.id === option.id)) {
        return prev.filter((opt) => opt.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const handleAdd = () => {
    setRestaurantId(restaurant_id);
    setTableId(table_id || "");
    addToOrder(
      {
        id: item.id,
        name: lang === "ar" ? item.name : item.name_en,
        comment: comment,
        price: parseFloat(item.price),
        image: item.image,
      },
      quantity, // ✅ الكمية المختارة
      selectedOptions,
    );
    toast.success(
      `${lang === "ar" ? "تمت إضافة" : "Added"} ${
        lang === "ar" ? item.name : item.name_en
      } (${quantity}x)`,
    );
    setOpen(false);
    setSelectedOptions([]);
    setQuantity(1);
    setComment("");
    setSelectedMenu(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="font-cairo relative overflow-hidden rounded-xl border border-orange-200/60 bg-gradient-to-r from-orange-500 to-amber-400 font-semibold text-white shadow-[0_12px_26px_-14px_rgba(234,88,12,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-16px_rgba(234,88,12,0.9)]"
        >
          <Plus className="h-4 w-4 ml-1" />
          {lang === "ar" ? "إضافة" : "Add"}
        </Button>
      </DialogTrigger>

      <DialogContent className="font-cairo max-h-[88vh] overflow-y-auto rounded-[26px] border border-slate-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] text-slate-900 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(10,15,30,0.96),rgba(5,8,20,0.92))] dark:text-white">
        <div className="absolute inset-x-4 top-3 h-14 rounded-full bg-gradient-to-r from-orange-400/30 via-amber-300/20 to-cyan-300/20 blur-2xl" />

        <DialogHeader>
          <DialogTitle className="text-lg font-black tracking-wide">
            {lang === "ar" ? "اختيار الإضافات" : "Choose options"}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-2 grid grid-cols-[92px_1fr] items-center gap-3 rounded-2xl border border-white/40 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
          <img
            src={item.image}
            alt={lang === "ar" ? item.name : item.name_en}
            className="h-20 w-20 rounded-xl object-cover shadow-md"
          />
          <div>
            <p className="text-base font-black leading-tight">
              {lang === "ar" ? item.name : item.name_en}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300/80">
              {Number(item.price).toFixed(2)} {lang === "ar" ? "جنيه" : "EGP"}
            </p>
          </div>
        </div>

        {item.options?.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {item.options.map((opt) => (
              <label
                key={opt.id}
                className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                  selectedOptions.find((o) => o.id === opt.id)
                    ? "border-orange-400/70 bg-orange-100/70 shadow-[0_14px_26px_-16px_rgba(234,88,12,0.65)] dark:bg-orange-500/16"
                    : "border-slate-200/90 bg-white/65 hover:border-orange-300/60 hover:bg-orange-50/65 dark:border-white/12 dark:bg-white/4 dark:hover:bg-white/8"
                }`}
              >
                <div>
                  <p className="font-bold">
                    {lang === "ar" ? opt.name : opt.name_en}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-300/70">
                    +{Number(opt.price).toFixed(2)}{" "}
                    {lang === "ar" ? "جنيه" : "EGP"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-orange-500"
                  checked={!!selectedOptions.find((o) => o.id === opt.id)}
                  onChange={() =>
                    toggleOption({
                      id: opt.id,
                      name: lang === "ar" ? opt.name : opt.name_en,
                      name_en: opt.name_en,
                      price: parseFloat(opt.price),
                    })
                  }
                />
              </label>
            ))}
          </div>
        ) : (
          <p className="py-3 text-center text-slate-500 dark:text-slate-300/70">
            {lang === "ar" ? "لا توجد إضافات" : "No options available"}
          </p>
        )}

        {/* ✅ الكمية */}
        <div className="mt-5 flex items-center justify-center gap-4 rounded-2xl border border-white/30 bg-white/60 py-3 dark:border-white/10 dark:bg-white/5">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-10 text-center text-lg font-black">
            {quantity}
          </span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* ✅ التعليق */}
        <div className="mt-5">
          <Label className="text-sm font-bold">
            {lang === "ar" ? "تعليق الطلب:" : "Order comment:"}
          </Label>
          <Textarea
            placeholder={
              lang === "ar" ? "أضف تعليقك هنا..." : "Add your comment here..."
            }
            className="mt-2 w-full rounded-xl border-slate-200 bg-white/75 dark:border-white/12 dark:bg-white/6"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* ✅ السعر الإجمالي */}
        <div className="mt-6 rounded-2xl border border-orange-200/60 bg-gradient-to-r from-orange-50 to-amber-50 p-3 text-center dark:border-orange-300/20 dark:bg-[linear-gradient(90deg,rgba(249,115,22,0.12),rgba(245,158,11,0.12))]">
          <p className="text-lg font-black">
            {lang === "ar" ? "السعر الكلي:" : "Total:"}{" "}
            <span className="text-orange-600 dark:text-amber-300">
              {totalPrice.toFixed(2)} {lang === "ar" ? "جنيه" : "EGP"}
            </span>
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAdd}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_18px_35px_-18px_rgba(234,88,12,0.92)] hover:from-orange-600 hover:to-amber-500"
          >
            <ShoppingCart className="h-4 w-4" />
            {lang === "ar"
              ? `أضف ${lang === "ar" ? item.name : item.name_en}`
              : `Add ${item.name_en}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
