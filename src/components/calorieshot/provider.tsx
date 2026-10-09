"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { db, type Meal, type Goals, type FoodDatabaseEntry, type FoodItem } from "@/lib/db-calorieshot";
import { FOOD_DATABASE_SEED, makeId } from "@/lib/food-database";

// ========================================
// Types
// ========================================
export type Route =
  | "home"
  | "scan"
  | "history"
  | "analytics"
  | "profile"
  | "onboarding";

export type ThemeMode = "light" | "dark";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
}

interface CalorieShotCtx {
  // navigation
  route: Route;
  navigate: (r: Route) => void;

  // online status
  online: boolean;

  // theme
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;

  // PWA install
  canInstall: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<void>;

  // toasts
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // data
  meals: Meal[];
  goals: Goals | null;
  foodDb: FoodDatabaseEntry[];
  ready: boolean;
  onboarded: boolean;

  // actions
  saveMeal: (meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  updateMeal: (meal: Meal) => Promise<void>;
  saveGoals: (g: Goals) => Promise<void>;
  setOnboarded: (v: boolean) => void;

  // search
  searchFoods: (q: string) => FoodDatabaseEntry[];

  // active meal detail
  activeMealId: string | null;
  setActiveMealId: (id: string | null) => void;
}

const Ctx = createContext<CalorieShotCtx | null>(null);

const DEFAULT_GOALS: Goals = {
  id: "default",
  dailyCalories: 2200,
  dailyProtein: 140,
  dailyCarbs: 250,
  dailyFat: 70,
  dailyFiber: 30,
  activityLevel: "moderate",
  dietaryPreference: "none",
  onboardedAt: Date.now(),
  updatedAt: Date.now(),
};

export function CalorieShotProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [online, setOnline] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goals | null>(null);
  const [foodDb, setFoodDb] = useState<FoodDatabaseEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboardedState] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // seed food database if empty
        const existing = await db.foodDatabase.count();
        if (existing === 0) {
          const entries: FoodDatabaseEntry[] = FOOD_DATABASE_SEED.map((e) => ({
            ...e,
            id: e.name.toLowerCase().replace(/\s+/g, "-"),
          }));
          await db.foodDatabase.bulkPut(entries);
        }
        const allFoods = await db.foodDatabase.toArray();
        if (mounted) setFoodDb(allFoods);

        const g = await db.goals.get("default");
        const obFlag =
          typeof window !== "undefined" ? localStorage.getItem("calorieshot_onboarded") === "1" : false;
        if (mounted) {
          setGoals(g ?? null);
          setOnboardedState(obFlag);
        }

        const m = await db.meals.orderBy("loggedAt").reverse().toArray();
        if (mounted) setMeals(m);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Theme init — apply saved or system theme
  useEffect(() => {
    try {
      const stored = localStorage.getItem("calorieshot_theme") as ThemeMode | null;
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const initial: ThemeMode = stored ?? (mql.matches ? "dark" : "light");
      setThemeState(initial);
      if (initial === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      // Listen to system changes if no explicit preference
      const handler = (e: MediaQueryListEvent) => {
        const s = localStorage.getItem("calorieshot_theme");
        if (!s) {
          const next: ThemeMode = e.matches ? "dark" : "light";
          setThemeState(next);
          if (next === "dark") document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        }
      };
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } catch {}
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem("calorieshot_theme", t);
      if (t === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // online status
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // Service worker registration + install prompt
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Detect if already installed (display-mode: standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall as EventListener);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = makeId("toast");
    setToasts((cur) => [...cur, { ...t, id }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((cur) => cur.filter((x) => x.id !== id));
  }, []);

  const saveMeal = useCallback(async (meal: Meal) => {
    await db.meals.put(meal);
    setMeals((cur) => {
      const others = cur.filter((m) => m.id !== meal.id);
      return [meal, ...others].sort((a, b) => b.loggedAt - a.loggedAt);
    });
  }, []);

  const updateMeal = useCallback(async (meal: Meal) => {
    await db.meals.put(meal);
    setMeals((cur) => cur.map((m) => (m.id === meal.id ? meal : m)));
  }, []);

  const deleteMeal = useCallback(async (id: string) => {
    await db.meals.delete(id);
    setMeals((cur) => cur.filter((m) => m.id !== id));
  }, []);

  const saveGoals = useCallback(async (g: Goals) => {
    const toSave = { ...g, id: "default", updatedAt: Date.now() };
    await db.goals.put(toSave);
    setGoals(toSave);
  }, []);

  const setOnboarded = useCallback((v: boolean) => {
    setOnboardedState(v);
    if (typeof window !== "undefined") {
      if (v) localStorage.setItem("calorieshot_onboarded", "1");
      else localStorage.removeItem("calorieshot_onboarded");
    }
  }, []);

  const searchFoods = useCallback(
    (q: string) => {
      const query = q.trim().toLowerCase();
      if (!query) return foodDb.slice(0, 30);
      return foodDb
        .filter((f) => {
          if (f.name.toLowerCase().includes(query)) return true;
          if (f.aliases?.some((a) => a.toLowerCase().includes(query))) return true;
          if (f.category.toLowerCase().includes(query)) return true;
          return false;
        })
        .slice(0, 30);
    },
    [foodDb]
  );

  const value = useMemo<CalorieShotCtx>(
    () => ({
      route,
      navigate,
      online,
      theme,
      setTheme,
      toggleTheme,
      canInstall: !!deferredPrompt,
      isInstalled,
      promptInstall,
      toasts,
      pushToast,
      dismissToast,
      meals,
      goals,
      foodDb,
      ready,
      onboarded,
      saveMeal,
      deleteMeal,
      updateMeal,
      saveGoals,
      setOnboarded,
      searchFoods,
      activeMealId,
      setActiveMealId,
    }),
    [
      route, navigate, online, theme, setTheme, toggleTheme, deferredPrompt, isInstalled, promptInstall,
      toasts, pushToast, dismissToast, meals, goals, foodDb, ready, onboarded,
      saveMeal, deleteMeal, updateMeal, saveGoals, setOnboarded, searchFoods, activeMealId,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCalorieShot() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCalorieShot must be used inside CalorieShotProvider");
  return ctx;
}

export { makeId };
export type { Meal, Goals, FoodItem, FoodDatabaseEntry };
