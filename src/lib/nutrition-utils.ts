import type { Meal, Goals } from "@/components/calorieshot/provider";

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  saturatedFat: number;
  cholesterol: number;
  count: number;
}

export function mealsOnDay(meals: Meal[], day: Date): Meal[] {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return meals.filter((m) => m.loggedAt >= start.getTime() && m.loggedAt < end.getTime());
}

export function computeDailyTotals(meals: Meal[]): DailyTotals {
  const t: DailyTotals = {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
    sugar: 0, sodium: 0, saturatedFat: 0, cholesterol: 0, count: meals.length,
  };
  for (const m of meals) {
    t.calories += m.totalCalories;
    t.protein += m.totalProtein;
    t.carbs += m.totalCarbs;
    t.fat += m.totalFat;
    t.fiber += m.totalFiber;
    t.sugar += m.totalSugar;
    t.sodium += m.totalSodium;
    t.saturatedFat += m.totalSaturatedFat;
    t.cholesterol += m.totalCholesterol;
  }
  return t;
}

export function remainingCalories(totals: DailyTotals, goals: Goals | null): number {
  const goal = goals?.dailyCalories ?? 0;
  return Math.max(0, goal - totals.calories);
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatRelative(d: Date | number): string {
  const t = typeof d === "number" ? d : d.getTime();
  const diff = Date.now() - t;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatTime(d: Date | number): string {
  const t = typeof d === "number" ? d : d.getTime();
  return new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatDate(d: Date | number): string {
  const t = typeof d === "number" ? d : d.getTime();
  return new Date(t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

export function inferMealType(): "breakfast" | "lunch" | "dinner" | "snack" {
  const h = new Date().getHours();
  if (h < 10) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 18) return "snack";
  return "dinner";
}

export const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  unknown: "Meal",
};

export const MEAL_TYPE_ICON_KEY: Record<string, string> = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner",
  snack: "snack",
  unknown: "bowl",
};

export function sumMacro(meals: Meal[], key: "totalCalories" | "totalProtein" | "totalCarbs" | "totalFat" | "totalFiber"): number {
  return meals.reduce((a, m) => a + (m[key] as number), 0);
}
