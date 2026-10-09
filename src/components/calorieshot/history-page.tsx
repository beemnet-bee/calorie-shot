"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot } from "./provider";
import { Card } from "./card";
import { Button } from "./button";
import { FoodIconByKey } from "./food-icon";
import { EmptyPlateIcon, CalendarIcon, PlusCircleIcon } from "./icons";
import {
  isSameDay,
  startOfDay,
  formatDate,
  formatTime,
  computeDailyTotals,
  MEAL_TYPE_LABEL,
  MEAL_TYPE_ICON_KEY,
} from "@/lib/nutrition-utils";
import { MealDetailSheet } from "./meal-detail-sheet";
import { ManualEntrySheet } from "./manual-entry-sheet";

export function HistoryPage() {
  const { meals, goals } = useCalorieShot();
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [manualOpen, setManualOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Build list of days to show:
  // 1. Always show the last 7 days (today + 6 days back) — gives users a familiar week view
  // 2. Plus any older days that have meals logged — so you can jump back to any past day you used
  // Sorted descending (most recent first)
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    const dayMap = new Map<string, Date>();

    // Add the last 7 days (today + 6 back) — always visible
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      if (!dayMap.has(key)) dayMap.set(key, d);
    }

    // Add every day that has at least one meal — so older history is always accessible
    for (const m of meals) {
      const d = startOfDay(new Date(m.loggedAt));
      const key = d.toDateString();
      if (!dayMap.has(key)) dayMap.set(key, d);
    }

    return Array.from(dayMap.values()).sort((a, b) => b.getTime() - a.getTime());
  }, [meals]);

  const mealsOnSelected = useMemo(
    () => meals.filter((m) => isSameDay(new Date(m.loggedAt), selectedDate)),
    [meals, selectedDate]
  );

  const totals = computeDailyTotals(mealsOnSelected);
  const goalCalories = goals?.dailyCalories ?? 2200;
  const pct = goalCalories > 0 ? Math.min(1, totals.calories / goalCalories) : 0;

  // Format date for the native date input (YYYY-MM-DD)
  const dateInputValue = (() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const onDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split("-").map(Number);
      setSelectedDate(new Date(y, m - 1, d, 0, 0, 0, 0));
    }
  };

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-32 lg:pb-12 max-w-2xl lg:max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight"><span className="text-gradient">History</span></h1>
        <p className="text-xs text-muted-foreground mt-0.5">All your logged meals</p>
      </div>

      {/* Date strip — all days with meals + today + calendar button */}
      <div className="mb-4 -mx-5 px-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {days.map((d) => {
            const active = isSameDay(d, selectedDate);
            const mealsCount = meals.filter((m) => isSameDay(new Date(m.loggedAt), d)).length;
            const isToday = isSameDay(d, new Date());
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={[
                  "shrink-0 flex flex-col items-center justify-center gap-0.5 w-14 h-20 r-md border transition-all",
                  active
                    ? "bg-brand-gradient text-white border-transparent shadow-glow"
                    : "glass text-foreground hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))]",
                ].join(" ")}
              >
                <span className={`text-[10px] uppercase ${active ? "text-white/80" : "text-muted-foreground"}`}>
                  {isToday ? "Today" : d.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="text-lg font-bold tabular-nums">{d.getDate()}</span>
                <span className={`text-[10px] ${active ? "text-white/80" : "text-muted-foreground"}`}>
                  {mealsCount > 0 ? `${mealsCount}` : "—"}
                </span>
              </button>
            );
          })}

          {/* Calendar button — jump to any date
              Uses a <label> wrapping a transparent <input type="date"> so clicking opens the
              native date picker reliably in all browsers (including cross-origin iframes,
              where showPicker() throws a SecurityError). */}
          <label
            className="shrink-0 relative flex flex-col items-center justify-center gap-0.5 w-14 h-20 r-md border glass text-foreground hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))] transition-all cursor-pointer"
            aria-label="Pick a date"
          >
            <CalendarIcon size={22} className="text-[color:var(--brand-2)]" />
            <span className="text-[9px] text-muted-foreground mt-0.5">Pick date</span>
            <input
              ref={dateInputRef}
              type="date"
              value={dateInputValue}
              onChange={onDateInputChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Select date"
            />
          </label>
        </div>
      </div>

      {/* Day summary card with gradient progress + add meal button */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">{formatDate(selectedDate)}</p>
            <p className="text-2xl font-bold tabular-nums">
              <span className="text-gradient-cal">{totals.calories.toLocaleString()}</span>
              <span className="text-sm font-normal text-muted-foreground"> / {goalCalories.toLocaleString()} kcal</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Meals</p>
            <p className="text-xl font-bold tabular-nums">{totals.count}</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-[color:var(--track)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <MiniMacro label="P" value={totals.protein} unit="g" color="var(--protein)" />
          <MiniMacro label="C" value={totals.carbs} unit="g" color="var(--carbs)" />
          <MiniMacro label="F" value={totals.fat} unit="g" color="var(--fat)" />
          <MiniMacro label="Fb" value={totals.fiber} unit="g" color="var(--fiber)" />
        </div>
        {/* Add meal to this day button */}
        <Button
          variant="glass"
          size="md"
          fullWidth
          className="mt-3"
          onClick={() => setManualOpen(true)}
        >
          <PlusCircleIcon size={18} />
          Add meal to this day
        </Button>
      </Card>

      {/* Meal list */}
      <h3 className="text-sm font-semibold mb-2 px-1">Meals</h3>
      {mealsOnSelected.length === 0 ? (
        <Card className="text-center py-10">
          <div className="flex justify-center mb-3 text-[color:var(--brand-2)]">
            <EmptyPlateIcon size={48} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">No meals on this day</p>
          <p className="text-xs text-muted-foreground mt-1">Pick another date or add a meal manually.</p>
          <Button size="sm" className="mt-3" onClick={() => setManualOpen(true)}>
            <PlusCircleIcon size={14} />
            Add a meal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <AnimatePresence initial={false}>
            {mealsOnSelected.map((m, i) => (
              <motion.button
                key={m.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: 0.04 * i, duration: 0.3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMealId(m.id)}
                className="w-full flex items-center gap-3 p-3 glass r-md text-left hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))] transition-colors"
              >
                {m.imageThumb ? (
                  <img src={m.imageThumb} alt="" className="w-14 h-14 r-sm object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)] shrink-0">
                    <FoodIconByKey iconKey={m.emoji || "bowl"} size={28} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FoodIconByKey iconKey={MEAL_TYPE_ICON_KEY[m.mealType] ?? "bowl"} size={14} className="text-muted-foreground" />
                    <p className="text-sm font-semibold truncate">{m.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTime(m.loggedAt)} · {MEAL_TYPE_LABEL[m.mealType]}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--track)] text-muted-foreground font-medium">
                      {m.foods.length} foods
                    </span>
                    {m.userConfirmed ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-gradient text-white font-medium">
                        Confirmed
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--cal-soft)] text-[color:var(--cal)] font-medium">
                        Estimate
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold tabular-nums text-gradient-cal">{m.totalCalories}</p>
                  <p className="text-[10px] text-muted-foreground">kcal</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      <MealDetailSheet mealId={activeMealId} onClose={() => setActiveMealId(null)} />
      <ManualEntrySheet
        open={manualOpen}
        targetDate={selectedDate}
        onClose={() => setManualOpen(false)}
      />
    </div>
  );
}

function MiniMacro({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] text-muted-foreground uppercase font-medium">{label}</span>
      <span className="text-xs font-bold tabular-nums ml-auto">
        {value}
        <span className="text-[9px] text-muted-foreground font-normal ml-0.5">{unit}</span>
      </span>
    </div>
  );
}
