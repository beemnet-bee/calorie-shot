"use client";

import { motion } from "framer-motion";
import { useCalorieShot } from "./provider";
import { ProgressRing, MacroBar } from "./progress-ring";
import { Button } from "./button";
import { Card, CardHeader } from "./card";
import {
  ProfileIcon,
  ScanIcon,
  EmptyPlateIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from "./icons";
import { FoodIconByKey } from "./food-icon";
import {
  computeDailyTotals,
  mealsOnDay,
  remainingCalories,
  greeting,
  formatRelative,
  MEAL_TYPE_LABEL,
  MEAL_TYPE_ICON_KEY,
} from "@/lib/nutrition-utils";

export function HomePage() {
  const { meals, goals, navigate, theme, toggleTheme } = useCalorieShot();

  const today = new Date();
  const todayMeals = mealsOnDay(meals, today);
  const totals = computeDailyTotals(todayMeals);
  const remaining = remainingCalories(totals, goals);
  const goalCalories = goals?.dailyCalories ?? 2200;

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-32 lg:pb-12 max-w-2xl lg:max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">{greeting()}</p>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-gradient">Today</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="glass" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </Button>
          <Button size="icon" variant="glass" onClick={() => navigate("profile")} aria-label="Profile">
            <ProfileIcon size={20} />
          </Button>
        </div>
      </div>

      {/* Desktop 2-column grid: hero + macros side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
      {/* Gradient hero calorie card */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative lg:col-span-3 r-xl overflow-hidden p-6 bg-brand-gradient shadow-glow-strong"
      >
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-[color:var(--brand-3)]/30 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center py-1">
          <ProgressRing
            value={totals.calories}
            max={goalCalories}
            size={176}
            strokeWidth={12}
            color="white"
            trackColor="rgba(255,255,255,0.18)"
            label={
              <>
                <span className="text-3xl font-bold tabular-nums text-white">
                  {totals.calories.toLocaleString()}
                </span>
                <span className="text-[11px] text-white/70 mt-0.5">of {goalCalories.toLocaleString()} kcal</span>
              </>
            }
            sublabel={
              <span className="text-xs font-medium text-white/80 mt-1">
                {remaining > 0 ? `${remaining.toLocaleString()} kcal left today` : "Goal reached"}
              </span>
            }
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-white/70">CalorieShot</span>
            <span className="text-[10px] text-white/50">·</span>
            <span className="text-[10px] text-white/70">
              {totals.count} {totals.count === 1 ? "meal" : "meals"} logged
            </span>
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <Card className="lg:col-span-2 mb-0">
        <CardHeader title="Macros" subtitle="Daily targets" />
        <MacroBar label="Protein" value={totals.protein} max={goals?.dailyProtein ?? 140} color="var(--protein)" />
        <MacroBar label="Carbs" value={totals.carbs} max={goals?.dailyCarbs ?? 250} color="var(--carbs)" />
        <MacroBar label="Fat" value={totals.fat} max={goals?.dailyFat ?? 70} color="var(--fat)" />
        <MacroBar label="Fiber" value={totals.fiber} max={goals?.dailyFiber ?? 30} color="var(--fiber)" />
      </Card>
      </div>
      {/* end grid */}

      {/* Quick CTA — Scan Meal */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
        onClick={() => navigate("scan")}
        className="w-full mb-4 relative overflow-hidden r-xl glass p-5 text-left flex items-center justify-between gap-3 hover:shadow-glow transition-shadow"
      >
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-50 pointer-events-none" />
        <div className="relative">
          <p className="text-xs text-muted-foreground mb-0.5">CalorieShot AI</p>
          <h3 className="text-lg font-semibold tracking-tight text-gradient">Scan a meal</h3>
          <p className="text-xs text-muted-foreground mt-1">Take or upload a photo. AI does the rest.</p>
        </div>
        <div className="relative shrink-0 w-14 h-14 r-md bg-brand-gradient grid place-items-center text-white shadow-glow">
          <ScanIcon size={26} />
        </div>
      </motion.button>

      {/* Recent meals */}
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">Recent meals</h3>
        <button
          onClick={() => navigate("history")}
          className="text-xs text-[color:var(--brand-2)] hover:text-[color:var(--brand-3)] transition-colors font-medium inline-flex items-center gap-1"
        >
          See all <ChevronRightIcon size={14} />
        </button>
      </div>
      {todayMeals.length === 0 ? (
        <Card className="text-center py-8">
          <div className="flex justify-center mb-3 text-[color:var(--brand-2)]">
            <EmptyPlateIcon size={48} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">No meals logged today</p>
          <p className="text-xs text-muted-foreground mt-1">Tap Scan to log your first meal.</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {todayMeals.slice(0, 3).map((m, i) => (
            <RecentMealRow key={m.id} meal={m} index={i} onClick={() => navigate("history")} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecentMealRow({ meal, index, onClick }: { meal: any; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 glass r-md text-left hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))] transition-colors"
    >
      {meal.imageThumb ? (
        <img src={meal.imageThumb} alt="" className="w-12 h-12 r-sm object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)] shrink-0">
          <FoodIconByKey iconKey={meal.mealEmoji || "bowl"} size={26} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <FoodIconByKey iconKey={MEAL_TYPE_ICON_KEY[meal.mealType] ?? "bowl"} size={16} className="text-muted-foreground" />
          <p className="text-sm font-semibold truncate">{meal.name}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatRelative(meal.loggedAt)} · {MEAL_TYPE_LABEL[meal.mealType]}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold tabular-nums text-gradient-cal">{meal.totalCalories}</p>
        <p className="text-[10px] text-muted-foreground">kcal</p>
      </div>
    </motion.button>
  );
}
