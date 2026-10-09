"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot } from "./provider";
import { Card } from "./card";
import { Button } from "./button";
import { ProgressRing } from "./progress-ring";
import { FoodIconByKey } from "./food-icon";
import {
  ChevronDownIcon,
  TrashIcon,
  XIcon,
} from "./icons";
import {
  formatRelative,
  formatTime,
  MEAL_TYPE_LABEL,
  MEAL_TYPE_ICON_KEY,
} from "@/lib/nutrition-utils";

export function MealDetailSheet({ mealId, onClose }: { mealId: string | null; onClose: () => void }) {
  const { meals, deleteMeal, pushToast } = useCalorieShot();
  const meal = meals.find((m) => m.id === mealId) ?? null;
  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!meal) return;
    await deleteMeal(meal.id);
    pushToast({ title: "Meal deleted", variant: "info" });
    onClose();
  };

  return (
    <AnimatePresence>
      {meal ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative mt-auto h-[90vh] bg-[color:var(--background)] rounded-t-[2rem] border-t border-[color:var(--line)] flex flex-col overflow-hidden shadow-glow-strong"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-[color:var(--line)]" />
            </div>

            <div className="overflow-y-auto flex-1">
              {meal.imageDataUrl ? (
                <div className="relative h-44">
                  <img src={meal.imageDataUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/50 to-transparent" />
                  <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FoodIconByKey iconKey={MEAL_TYPE_ICON_KEY[meal.mealType] ?? "bowl"} size={14} className="text-[color:var(--brand-2)]" />
                      <span className="text-[10px] uppercase tracking-wide text-[color:var(--brand-2)] font-medium">
                        {MEAL_TYPE_LABEL[meal.mealType]} · {formatRelative(meal.loggedAt)} · {formatTime(meal.loggedAt)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gradient">{meal.name}</h2>
                  </div>
                </div>
              ) : (
                <div className="px-5 pt-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <FoodIconByKey iconKey={MEAL_TYPE_ICON_KEY[meal.mealType] ?? "bowl"} size={14} className="text-[color:var(--brand-2)]" />
                    <span className="text-[10px] uppercase tracking-wide text-[color:var(--brand-2)] font-medium">
                      {MEAL_TYPE_LABEL[meal.mealType]} · {formatRelative(meal.loggedAt)} · {formatTime(meal.loggedAt)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-gradient">{meal.name}</h2>
                </div>
              )}

              <div className="p-5">
                <Card className="mb-3">
                  <div className="flex items-center gap-4">
                    <ProgressRing
                      value={meal.totalCalories}
                      max={Math.max(meal.totalCalories, 1)}
                      size={96}
                      strokeWidth={9}
                      gradient
                      label={
                        <>
                          <span className="text-xl font-bold tabular-nums text-gradient-cal">{meal.totalCalories}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">kcal</span>
                        </>
                      }
                    />
                    <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2">
                      <DetailMacro label="Protein" value={meal.totalProtein} unit="g" color="var(--protein)" />
                      <DetailMacro label="Carbs" value={meal.totalCarbs} unit="g" color="var(--carbs)" />
                      <DetailMacro label="Fat" value={meal.totalFat} unit="g" color="var(--fat)" />
                      <DetailMacro label="Fiber" value={meal.totalFiber} unit="g" color="var(--fiber)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[color:var(--line)]">
                    <DetailMacro label="Sugar" value={meal.totalSugar} unit="g" color="var(--carbs)" compact />
                    <DetailMacro label="Sodium" value={meal.totalSodium} unit="mg" color="var(--fat)" compact />
                    <DetailMacro label="Sat. fat" value={meal.totalSaturatedFat} unit="g" color="var(--cal)" compact />
                    <DetailMacro label="Cholesterol" value={meal.totalCholesterol} unit="mg" color="var(--fiber)" compact />
                  </div>
                </Card>

                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold">Foods</h3>
                  <span className="text-xs text-muted-foreground">{meal.foods.length} items</span>
                </div>

                <div className="grid gap-2 mb-3">
                  {meal.foods.map((f) => (
                    <div key={f.id} className="r-md glass overflow-hidden">
                      <button
                        onClick={() => setExpandedFoodId(expandedFoodId === f.id ? null : f.id)}
                        className="w-full p-3 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)] shrink-0">
                          <FoodIconByKey iconKey={f.emoji || "bowl"} size={22} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {Math.round(f.servingGrams)} g · <span className="text-gradient-cal font-semibold">{f.calories} kcal</span>
                          </p>
                        </div>
                        {f.source === "ai" ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[color:var(--cal-soft)] text-[color:var(--cal)] font-bold">
                            AI
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-gradient text-white font-bold">
                            YOU
                          </span>
                        )}
                        <motion.span animate={{ rotate: expandedFoodId === f.id ? 180 : 0 }} className="text-[color:var(--brand-2)]">
                          <ChevronDownIcon size={16} />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedFoodId === f.id ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-1 border-t border-[color:var(--line)] grid grid-cols-2 gap-2">
                              <DetailMacro label="Protein" value={f.protein} unit="g" color="var(--protein)" compact />
                              <DetailMacro label="Carbs" value={f.carbs} unit="g" color="var(--carbs)" compact />
                              <DetailMacro label="Fat" value={f.fat} unit="g" color="var(--fat)" compact />
                              <DetailMacro label="Fiber" value={f.fiber} unit="g" color="var(--fiber)" compact />
                              <DetailMacro label="Sugar" value={f.sugar} unit="g" color="var(--carbs)" compact />
                              <DetailMacro label="Sodium" value={f.sodium} unit="mg" color="var(--fat)" compact />
                              <DetailMacro label="Sat. fat" value={f.saturatedFat} unit="g" color="var(--cal)" compact />
                              <DetailMacro label="Cholesterol" value={f.cholesterol} unit="mg" color="var(--fiber)" compact />
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="grid gap-2 mt-4">
                  {!confirmDelete ? (
                    <Button variant="glass" size="md" fullWidth onClick={() => setConfirmDelete(true)}>
                      <TrashIcon size={16} />
                      Delete meal
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" size="md" fullWidth onClick={() => setConfirmDelete(false)}>
                        <XIcon size={16} />
                        Cancel
                      </Button>
                      <Button variant="danger" size="md" fullWidth onClick={handleDelete}>
                        Yes, delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailMacro({
  label,
  value,
  unit,
  color,
  compact = false,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      <span className={`ml-auto tabular-nums font-bold ${compact ? "text-xs" : "text-sm"}`}>
        {value}
        <span className="text-[10px] text-muted-foreground font-normal ml-0.5">{unit}</span>
      </span>
    </div>
  );
}
