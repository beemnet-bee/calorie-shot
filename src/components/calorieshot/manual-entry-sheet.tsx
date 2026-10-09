"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot, type FoodItem, type Meal } from "./provider";
import { ManualEntryView } from "./manual-entry-view";
import { XIcon } from "./icons";
import { formatDate } from "@/lib/nutrition-utils";

export function ManualEntrySheet({
  open,
  targetDate,
  onClose,
}: {
  open: boolean;
  targetDate: Date;
  onClose: () => void;
}) {
  const { saveMeal, pushToast } = useCalorieShot();

  const handleSave = useCallback(
    async (
      foods: FoodItem[],
      name: string,
      emoji: string,
      mealType: Meal["mealType"],
      userConfirmed: boolean,
      loggedAt?: number
    ) => {
      const sum = (k: keyof FoodItem) => foods.reduce((a, f) => a + (f[k] as number), 0);
      const meal: Meal = {
        id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        emoji,
        foods,
        totalCalories: Math.round(sum("calories")),
        totalProtein: Math.round(sum("protein") * 10) / 10,
        totalCarbs: Math.round(sum("carbs") * 10) / 10,
        totalFat: Math.round(sum("fat") * 10) / 10,
        totalFiber: Math.round(sum("fiber") * 10) / 10,
        totalSugar: Math.round(sum("sugar") * 10) / 10,
        totalSodium: Math.round(sum("sodium")),
        totalSaturatedFat: Math.round(sum("saturatedFat") * 10) / 10,
        totalCholesterol: Math.round(sum("cholesterol")),
        loggedAt: loggedAt ?? targetDate.getTime(),
        mealType,
        userConfirmed,
      };
      await saveMeal(meal);
      pushToast({
        title: "Meal added",
        description: `${meal.name} · ${meal.totalCalories} kcal · ${formatDate(targetDate)}`,
        variant: "success",
      });
      onClose();
    },
    [saveMeal, pushToast, targetDate, onClose]
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative mt-auto h-[90vh] bg-[color:var(--background)] rounded-t-[2rem] flex flex-col overflow-hidden shadow-glow-strong"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-[color:var(--line)]" />
            </div>

            <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Add meal to <span className="text-gradient">{formatDate(targetDate)}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">No photo needed — search and add foods manually</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[color:var(--surface-2)] grid place-items-center text-muted-foreground hover:bg-[color:var(--accent)] transition-colors shrink-0"
                aria-label="Close"
              >
                <XIcon size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 pb-5">
              <ManualEntryView onSave={handleSave} targetDate={targetDate} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
