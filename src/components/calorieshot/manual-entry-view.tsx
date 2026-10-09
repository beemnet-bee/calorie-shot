"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Card } from "./card";
import { ProgressRing } from "./progress-ring";
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
  TrashIcon,
  PencilIcon,
  CheckIcon,
} from "./icons";

const MEAL_TYPE_ICONS = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
} as const;

export function ManualEntryView({
  onSave,
  targetDate,
}: {
  onSave: (
    foods: FoodItem[],
    name: string,
    emoji: string,
    mealType: Meal["mealType"],
    userConfirmed: boolean,
    loggedAt?: number
  ) => Promise<void>;
  targetDate?: Date; // If provided, the meal will be logged to this date instead of now
}) {
  const { searchFoods } = useCalorieShot();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mealName, setMealName] = useState("");
  const [mealEmoji, setMealEmoji] = useState("bowl");
  const [mealType, setMealType] = useState<Meal["mealType"]>(inferMealType());
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
    };
  }, [foods]);

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

  const handleSave = useCallback(async () => {
    if (foods.length === 0) return;
    setSaving(true);
    try {
      // If targetDate is provided, use its timestamp (preserving the time of day for meal type)
      // Otherwise use Date.now()
      const loggedAt = targetDate ? targetDate.getTime() : Date.now();
      await onSave(
        foods,
        mealName.trim() || (foods.length === 1 ? foods[0].name : "Custom meal"),
        mealEmoji,
        mealType,
        true, // manual entries are always "user confirmed"
        loggedAt
      );
    } finally {
      setSaving(false);
    }
  }, [foods, mealName, mealEmoji, mealType, onSave, targetDate]);

  // Auto-name from first food if empty
  const displayName = mealName.trim() || (foods.length === 1 ? foods[0].name : "");

  return (
    <div className="pb-4">
      {/* Meal name + type card */}
      <Card className="mb-3">
        <label className="block">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Meal name</span>
          <input
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder={foods.length === 1 ? foods[0].name : "e.g. Lunch with friends"}
            className="mt-1 w-full h-11 px-3 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
          />
        </label>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
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
      </Card>

      {/* Live totals card */}
      {foods.length > 0 ? (
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
      ) : null}

      {/* Foods section */}
      <div className="px-1 mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {foods.length === 0 ? "Add your foods" : `Foods (${foods.length})`}
        </h3>
        <button
          onClick={() => setSearchOpen(true)}
          className="text-xs text-[color:var(--brand-2)] font-medium hover:text-[color:var(--brand-3)] transition-colors inline-flex items-center gap-1"
        >
          <PlusIcon size={14} />
          Add
        </button>
      </div>

      {foods.length === 0 ? (
        <Card className="text-center py-8 mb-3">
          <div className="flex justify-center mb-3 text-[color:var(--brand-2)]">
            <PencilIcon size={36} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">Search and add foods manually</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[260px] mx-auto">
            No photo needed. Pick from our database of Ethiopian and international dishes, or enter custom values.
          </p>
          <Button size="sm" className="mt-3" onClick={() => setSearchOpen(true)}>
            <PlusIcon size={14} />
            Add first food
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

      {/* Save */}
      <div className="grid gap-2 mt-4">
        <Button size="lg" fullWidth loading={saving} disabled={foods.length === 0} onClick={handleSave}>
          <CheckIcon size={18} />
          Save meal · {totals.calories} kcal
        </Button>
      </div>

      <FoodSearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPick={(entry) => {
          addFood({
            id: `food_user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
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
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-gradient text-white font-bold">
                YOU
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Math.round(food.servingGrams)} g · <span className="text-gradient-cal font-semibold">{food.calories} kcal</span>
            </p>
          </button>
          <button onClick={onEdit} className="text-xs text-[color:var(--brand-2)] font-medium mt-1 hover:text-[color:var(--brand-3)] transition-colors">
            Edit
          </button>
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
                      onChange={(e) => onChange({ name: e.target.value })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Icon</span>
                    <input
                      value={food.emoji}
                      onChange={(e) => onChange({ emoji: e.target.value })}
                      placeholder="rice, stew, bread..."
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Serving (g) — auto-recalculates nutrition</span>
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
                      onChange={(e) => onChange({ calories: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Protein (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.protein}
                      onChange={(e) => onChange({ protein: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Carbs (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.carbs}
                      onChange={(e) => onChange({ carbs: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Fat (g)</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={food.fat}
                      onChange={(e) => onChange({ fat: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full h-9 px-2.5 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button onClick={onRemove} className="text-xs text-[color:var(--destructive)] font-medium hover:opacity-80 inline-flex items-center gap-1">
                    <TrashIcon size={12} />
                    Remove
                  </button>
                  <button onClick={onEdit} className="text-xs text-[color:var(--brand-2)] font-medium hover:text-[color:var(--brand-3)] transition-colors">
                    Done
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
