"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Card } from "./card";
import { ProgressRing, MacroBar } from "./progress-ring";
import { useCalorieShot, type FoodItem, type Meal } from "./provider";
import { inferMealType, MEAL_TYPE_LABEL } from "@/lib/nutrition-utils";
import { FoodSearchSheet } from "./food-search-sheet";
import { FoodIconByKey } from "./food-icon";
import {
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  SnackIcon,
  ChevronDownIcon,
  PlusIcon,
  CheckIcon,
  ChevronRightIcon,
} from "./icons";

const MEAL_TYPE_ICONS = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
} as const;

interface ResultFood {
  name: string;
  emoji: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  saturatedFat: number;
  cholesterol: number;
  confidence: number;
}

interface AnalysisResult {
  mealName: string;
  mealEmoji: string;
  mealType: string;
  foods: ResultFood[];
  overallConfidence: number;
}

export function ResultsView({
  result,
  imageDataUrl,
  onSave,
}: {
  result: AnalysisResult;
  imageDataUrl?: string;
  onSave: (
    foods: FoodItem[],
    name: string,
    emoji: string,
    mealType: Meal["mealType"],
    userConfirmed: boolean
  ) => Promise<void>;
}) {
  const { searchFoods } = useCalorieShot();

  const [foods, setFoods] = useState<FoodItem[]>(() =>
    result.foods.map((f, i) => ({
      id: `food_${i}_${Date.now().toString(36)}`,
      name: f.name,
      emoji: f.emoji,
      servingGrams: f.servingGrams,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fiber: f.fiber,
      sugar: f.sugar,
      sodium: f.sodium,
      saturatedFat: f.saturatedFat,
      cholesterol: f.cholesterol,
      confidence: f.confidence,
      source: "ai" as const,
    }))
  );

  const [mealName, setMealName] = useState(result.mealName);
  const [mealEmoji, setMealEmoji] = useState(result.mealEmoji);
  const [mealType, setMealType] = useState<Meal["mealType"]>(
    (["breakfast", "lunch", "dinner", "snack", "unknown"].includes(result.mealType)
      ? result.mealType
      : inferMealType()) as Meal["mealType"]
  );
  const [showAllNutrition, setShowAllNutrition] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const sum = (k: keyof FoodItem) => foods.reduce((a, f) => a + (f[k] as number), 0);
    return {
      calories: Math.round(sum("calories")),
      protein: Math.round(sum("protein") * 10) / 10,
      carbs: Math.round(sum("carbs") * 10) / 10,
      fat: Math.round(sum("fat") * 10) / 10,
      fiber: Math.round(sum("fiber") * 10) / 10,
      sugar: Math.round(sum("sugar") * 10) / 10,
      sodium: Math.round(sum("sodium")),
      saturatedFat: Math.round(sum("saturatedFat") * 10) / 10,
      cholesterol: Math.round(sum("cholesterol")),
    };
  }, [foods]);

  const userEdited = foods.some((f) => f.source === "user");

  const updateFood = useCallback((id: string, patch: Partial<FoodItem>) => {
    setFoods((cur) => cur.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const removeFood = useCallback((id: string) => {
    setFoods((cur) => cur.filter((f) => f.id !== id));
  }, []);

  const addFood = useCallback((food: FoodItem) => {
    setFoods((cur) => [...cur, food]);
    setSearchOpen(false);
  }, []);

  const handleSave = useCallback(
    async (confirmed: boolean) => {
      setSaving(true);
      try {
        await onSave(foods, mealName.trim() || "Untitled meal", mealEmoji, mealType, confirmed);
      } finally {
        setSaving(false);
      }
    },
    [foods, mealName, mealEmoji, mealType, onSave]
  );

  return (
    <div className="pb-4">
      {/* Hero with gradient overlay */}
      <Card padded={false} className="overflow-hidden mb-3">
        {imageDataUrl ? (
          <div className="relative h-44">
            <img src={imageDataUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/40 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <input
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="bg-transparent text-foreground text-2xl font-bold tracking-tight w-full outline-none border-b border-[color:var(--brand-2)]/40 pb-0.5 focus:border-[color:var(--brand-2)] transition-colors"
                aria-label="Meal name"
              />
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map((t) => {
                  const Icon = MEAL_TYPE_ICONS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setMealType(t)}
                      className={[
                        "text-[11px] font-medium px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1",
                        mealType === t
                          ? "bg-brand-gradient text-white shadow-glow"
                          : "glass text-foreground/80 hover:text-foreground",
                      ].join(" ")}
                    >
                      <Icon size={14} />
                      {MEAL_TYPE_LABEL[t]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Confidence indicator */}
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--cal-soft)] text-[color:var(--cal)] font-semibold">
            AI Estimated
          </span>
          <span className="text-muted-foreground">
            {Math.round(result.overallConfidence * 100)}% confidence
          </span>
        </span>
        {userEdited ? (
          <span className="text-xs text-[color:var(--protein)] font-medium">User edits applied</span>
        ) : null}
      </div>

      {/* Hero totals card */}
      <Card className="mb-3">
        <div className="flex items-center gap-4">
          <ProgressRing
            value={totals.calories}
            max={Math.max(totals.calories, 1)}
            size={96}
            strokeWidth={9}
            gradient
            label={
              <>
                <span className="text-xl font-bold tabular-nums text-gradient-cal">{totals.calories}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">kcal</span>
              </>
            }
          />
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1">
            <MacroMini label="Protein" value={totals.protein} unit="g" color="var(--protein)" />
            <MacroMini label="Carbs" value={totals.carbs} unit="g" color="var(--carbs)" />
            <MacroMini label="Fat" value={totals.fat} unit="g" color="var(--fat)" />
            <MacroMini label="Fiber" value={totals.fiber} unit="g" color="var(--fiber)" />
          </div>
        </div>
      </Card>

      {/* Detected Foods */}
      <div className="px-1 mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Detected foods</h3>
        <button
          onClick={() => setSearchOpen(true)}
          className="text-xs text-[color:var(--brand-2)] font-medium hover:text-[color:var(--brand-3)] transition-colors inline-flex items-center gap-1"
        >
          <PlusIcon size={14} />
          Add
        </button>
      </div>

      {foods.length === 0 ? (
        <Card className="text-center py-6 mb-3">
          <p className="text-sm text-muted-foreground">No foods yet. Add one to start tracking.</p>
          <Button size="sm" className="mt-3" onClick={() => setSearchOpen(true)}>
            Add a food
          </Button>
        </Card>
      ) : (
        <div className="grid gap-2 mb-3">
          {foods.map((f, i) => (
            <FoodRow
              key={f.id}
              food={f}
              index={i}
              editing={editingFoodId === f.id}
              onEdit={() => setEditingFoodId(editingFoodId === f.id ? null : f.id)}
              onChange={(patch) => updateFood(f.id, patch)}
              onRemove={() => removeFood(f.id)}
            />
          ))}
        </div>
      )}

      {/* Secondary nutrition */}
      <Card className="mb-3">
        <button
          onClick={() => setShowAllNutrition(!showAllNutrition)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm font-semibold">More nutrition</span>
          <motion.span animate={{ rotate: showAllNutrition ? 180 : 0 }} className="text-[color:var(--brand-2)]">
            <ChevronDownIcon size={16} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showAllNutrition ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <MacroBar label="Sugar" value={totals.sugar} max={50} unit="g" color="var(--carbs)" compact />
                <MacroBar label="Sodium" value={totals.sodium} max={2300} unit="mg" color="var(--fat)" compact />
                <MacroBar label="Saturated fat" value={totals.saturatedFat} max={20} unit="g" color="var(--cal)" compact />
                <MacroBar label="Cholesterol" value={totals.cholesterol} max={300} unit="mg" color="var(--fiber)" compact />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>

      {/* Save */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button variant="glass" size="lg" loading={saving} onClick={() => handleSave(false)}>
          Save as estimate
        </Button>
        <Button size="lg" loading={saving} onClick={() => handleSave(true)}>
          Confirm & save
        </Button>
      </div>

      <FoodSearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPick={(entry) => {
          addFood({
            id: `food_user_${Date.now().toString(36)}`,
            name: entry.name,
            emoji: entry.emoji,
            servingGrams: entry.defaultServingGrams,
            calories: Math.round((entry.per100g.calories * entry.defaultServingGrams) / 100),
            protein: Math.round((entry.per100g.protein * entry.defaultServingGrams) / 100 * 10) / 10,
            carbs: Math.round((entry.per100g.carbs * entry.defaultServingGrams) / 100 * 10) / 10,
            fat: Math.round((entry.per100g.fat * entry.defaultServingGrams) / 100 * 10) / 10,
            fiber: Math.round((entry.per100g.fiber * entry.defaultServingGrams) / 100 * 10) / 10,
            sugar: Math.round((entry.per100g.sugar * entry.defaultServingGrams) / 100 * 10) / 10,
            sodium: Math.round((entry.per100g.sodium * entry.defaultServingGrams) / 100),
            saturatedFat: Math.round((entry.per100g.saturatedFat * entry.defaultServingGrams) / 100 * 10) / 10,
            cholesterol: Math.round((entry.per100g.cholesterol * entry.defaultServingGrams) / 100),
            confidence: 1,
            source: "user",
            foodDatabaseId: entry.id,
          });
        }}
      />
    </div>
  );
}

function MacroMini({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold tabular-nums">
        {value}
        <span className="text-[10px] text-muted-foreground ml-1 font-normal">{unit}</span>
      </p>
    </div>
  );
}

function FoodRow({
  food,
  index,
  editing,
  onEdit,
  onChange,
  onRemove,
}: {
  food: FoodItem;
  index: number;
  editing: boolean;
  onEdit: () => void;
  onChange: (patch: Partial<FoodItem>) => void;
  onRemove: () => void;
}) {
  const recalcFromGrams = (g: number) => {
    if (g <= 0) return;
    const ratio = g / (food.servingGrams || 1);
    onChange({
      servingGrams: g,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      fiber: Math.round(food.fiber * ratio * 10) / 10,
      sugar: Math.round(food.sugar * ratio * 10) / 10,
      sodium: Math.round(food.sodium * ratio),
      saturatedFat: Math.round(food.saturatedFat * ratio * 10) / 10,
      cholesterol: Math.round(food.cholesterol * ratio),
      source: "user",
    });
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * index, duration: 0.3 }}>
      <Card padded={false} className="p-3 hover:border-[color:color-mix(in_oklab,var(--brand-2)_25%,var(--line))] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)] shrink-0">
            <FoodIconByKey iconKey={food.emoji || "bowl"} size={24} />
          </div>
          <button onClick={onEdit} className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate">{food.name}</p>
              {food.source === "ai" ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[color:var(--cal-soft)] text-[color:var(--cal)] font-bold">
                  AI
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-gradient text-white font-bold">
                  YOU
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Math.round(food.servingGrams)} g · <span className="text-gradient-cal font-semibold">{food.calories} kcal</span>
            </p>
          </button>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <CheckIcon size={10} />
              {Math.round(food.confidence * 100)}%
            </div>
            <button onClick={onEdit} className="text-xs text-[color:var(--brand-2)] font-medium mt-1 hover:text-[color:var(--brand-3)] transition-colors">
              Edit
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {editing ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-[color:var(--line)] space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Name</span>
                    <input
                      value={food.name}
                      onChange={(e) => onChange({ name: e.target.value, source: "user" })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Icon</span>
                    <input
                      value={food.emoji}
                      onChange={(e) => onChange({ emoji: e.target.value, source: "user" })}
                      placeholder="rice, stew, bread..."
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Serving (g)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={Math.round(food.servingGrams)}
                    onChange={(e) => recalcFromGrams(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Calories</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.calories}
                      onChange={(e) => onChange({ calories: parseFloat(e.target.value) || 0, source: "user" })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Protein (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.protein}
                      onChange={(e) => onChange({ protein: parseFloat(e.target.value) || 0, source: "user" })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Carbs (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.carbs}
                      onChange={(e) => onChange({ carbs: parseFloat(e.target.value) || 0, source: "user" })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Fat (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.fat}
                      onChange={(e) => onChange({ fat: parseFloat(e.target.value) || 0, source: "user" })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button onClick={onRemove} className="text-xs text-[color:var(--destructive)] font-medium hover:opacity-80">
                    Remove food
                  </button>
                  <button onClick={onEdit} className="text-xs text-[color:var(--brand-2)] font-medium hover:text-[color:var(--brand-3)] transition-colors inline-flex items-center gap-1">
                    Done <ChevronRightIcon size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
