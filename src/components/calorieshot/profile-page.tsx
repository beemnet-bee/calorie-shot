"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCalorieShot, type Goals } from "./provider";
import { Card, CardHeader } from "./card";
import { Button } from "./button";
import { MacroBar } from "./progress-ring";
import {
  SunIcon,
  MoonIcon,
  PlusIcon,
  MinusIcon,
  DownloadIcon,
  RefreshIcon,
  NoPrefIcon,
  VegIcon,
  VeganIcon,
  HalalIcon,
  KetoIcon,
  PescatarianIcon,
} from "./icons";

const ACTIVITY_OPTIONS: { value: NonNullable<Goals["activityLevel"]>; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Lightly active" },
  { value: "moderate", label: "Moderately active" },
  { value: "active", label: "Very active" },
  { value: "veryActive", label: "Athlete" },
];

const DIET_OPTIONS: { value: NonNullable<Goals["dietaryPreference"]>; label: string; Icon: typeof NoPrefIcon }[] = [
  { value: "none", label: "No preference", Icon: NoPrefIcon },
  { value: "vegetarian", label: "Vegetarian", Icon: VegIcon },
  { value: "vegan", label: "Vegan", Icon: VeganIcon },
  { value: "halal", label: "Halal", Icon: HalalIcon },
  { value: "keto", label: "Keto", Icon: KetoIcon },
  { value: "pescatarian", label: "Pescatarian", Icon: PescatarianIcon },
];

export function ProfilePage() {
  const {
    goals, saveGoals, pushToast, meals, setOnboarded, navigate,
    theme, setTheme, canInstall, isInstalled, promptInstall,
  } = useCalorieShot();
  const [form, setForm] = useState<Goals>(
    goals ?? {
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
    }
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (goals) setForm(goals);
  }, [goals]);

  const update = (patch: Partial<Goals>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };

  const handleSave = async () => {
    await saveGoals(form);
    pushToast({ title: "Goals saved", variant: "success" });
    setDirty(false);
  };

  const handleInstall = async () => {
    await promptInstall();
    if (isInstalled) {
      pushToast({ title: "App installed", description: "Find it on your home screen.", variant: "success" });
    }
  };

  const totalMeals = meals.length;
  const totalCalories = meals.reduce((a, m) => a + m.totalCalories, 0);
  const avgCalories = totalMeals > 0 ? Math.round(totalCalories / Math.max(1, new Set(meals.map((m) => new Date(m.loggedAt).toDateString())).size)) : 0;

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-32 lg:pb-12 max-w-2xl lg:max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><span className="text-gradient">Profile</span></h1>
          <p className="text-xs text-muted-foreground mt-0.5">Goals & preferences</p>
        </div>
      </div>

      {/* Quick stats + Appearance — 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Quick stats with gradient numbers */}
      <Card className="mb-0">
        <CardHeader title="Your activity" subtitle="Across all logged meals" />
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-gradient">{totalMeals}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mt-0.5">Meals</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gradient">{avgCalories.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mt-0.5">Avg kcal</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gradient">{totalCalories.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mt-0.5">Total kcal</p>
          </div>
        </div>
      </Card>

      {/* Theme + Install section */}
      <Card className="mb-0">
        <CardHeader title="Appearance & app" subtitle="Theme & PWA install" />

        <div className="flex items-center justify-between py-2.5">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-[10px] text-muted-foreground">Light or dark mode</p>
          </div>
          <div className="flex gap-1 p-1 bg-[color:var(--surface-2)] r-sm">
            <button
              onClick={() => setTheme("light")}
              className={[
                "h-9 px-3 r-sm text-xs font-medium inline-flex items-center gap-1.5 transition-all",
                theme === "light"
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <SunIcon size={14} />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={[
                "h-9 px-3 r-sm text-xs font-medium inline-flex items-center gap-1.5 transition-all",
                theme === "dark"
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <MoonIcon size={14} />
              Dark
            </button>
          </div>
        </div>

        <div className="border-t border-[color:var(--line)] pt-3">
          {isInstalled ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--protein)]">
                <DownloadIcon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">App installed</p>
                <p className="text-[10px] text-muted-foreground">Running as a standalone app · works offline</p>
              </div>
            </div>
          ) : canInstall ? (
            <Button variant="accent" size="md" fullWidth onClick={handleInstall}>
              <DownloadIcon size={18} />
              Install CalorieShot app
            </Button>
          ) : (
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 r-sm bg-[color:var(--surface-2)] grid place-items-center text-muted-foreground">
                <DownloadIcon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Install as app</p>
                <p className="text-[10px] text-muted-foreground">
                  Use your browser menu → &quot;Install app&quot; or &quot;Add to Home Screen&quot;.
                  Works offline after first load.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      </div>
      {/* end grid */}

      {/* Goals + Optional details — 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Goals */}
      <Card className="mb-0">
        <CardHeader title="Daily nutrition goals" subtitle="Tap a value to edit" />

        <NumberRow label="Daily calories" value={form.dailyCalories} unit="kcal" step={50} min={800} max={6000}
          onChange={(v) => update({ dailyCalories: v })}
        />
        <NumberRow label="Protein" value={form.dailyProtein} unit="g" step={5} min={20} max={400}
          onChange={(v) => update({ dailyProtein: v })}
        />
        <NumberRow label="Carbs" value={form.dailyCarbs} unit="g" step={5} min={20} max={600}
          onChange={(v) => update({ dailyCarbs: v })}
        />
        <NumberRow label="Fat" value={form.dailyFat} unit="g" step={2} min={10} max={200}
          onChange={(v) => update({ dailyFat: v })}
        />
        <NumberRow label="Fiber" value={form.dailyFiber} unit="g" step={1} min={5} max={80}
          onChange={(v) => update({ dailyFiber: v })}
        />

        <div className="mt-3 pt-3 border-t border-[color:var(--line)] space-y-1">
          <MacroBar label="Protein" value={0} max={form.dailyProtein} color="var(--protein)" compact />
          <MacroBar label="Carbs" value={0} max={form.dailyCarbs} color="var(--carbs)" compact />
          <MacroBar label="Fat" value={0} max={form.dailyFat} color="var(--fat)" compact />
        </div>
      </Card>

      {/* Optional profile */}
      <Card className="mb-0">
        <CardHeader title="Optional details" subtitle="Used for smarter estimates" />

        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-2">Activity level</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ACTIVITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => update({ activityLevel: o.value })}
              className={[
                "text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                form.activityLevel === o.value
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "glass text-foreground/70 hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))]",
              ].join(" ")}
            >
              {o.label}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-2">Dietary preference</p>
        <div className="flex flex-wrap gap-1.5">
          {DIET_OPTIONS.map((o) => {
            const Icon = o.Icon;
            return (
              <button
                key={o.value}
                onClick={() => update({ dietaryPreference: o.value })}
                className={[
                  "text-xs font-medium px-3 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5",
                  form.dietaryPreference === o.value
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "glass text-foreground/70 hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))]",
                ].join(" ")}
              >
                <Icon size={14} />
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Weight goal (kg)</span>
            <input
              type="number"
              inputMode="decimal"
              value={form.weightGoalKg ?? ""}
              onChange={(e) => update({ weightGoalKg: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Optional"
              className="mt-1 w-full h-11 px-3 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
            />
          </label>
        </div>
      </Card>
      </div>
      {/* end grid */}

      {/* Save */}
      <Button size="lg" fullWidth disabled={!dirty} onClick={handleSave}>
        Save changes
      </Button>

      <button
        onClick={() => {
          setOnboarded(false);
          navigate("onboarding");
        }}
        className="mt-4 mx-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--brand-2)] transition-colors"
      >
        <RefreshIcon size={12} />
        Replay onboarding
      </button>

      <p className="mt-6 text-center text-[10px] text-muted-foreground/70">
        <span className="text-gradient font-semibold">CalorieShot</span> · Snap it. Know it. Track it.
        <br />
        All values are estimates — not medical advice.
      </p>
    </div>
  );
}

function NumberRow({
  label,
  value,
  unit,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[color:var(--line)] last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{unit}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 r-sm bg-[color:var(--surface-2)] hover:bg-[color:color-mix(in_oklab,var(--surface-2)_70%,var(--brand-2)_15%))] grid place-items-center transition-colors text-muted-foreground hover:text-[color:var(--brand-2)]"
          aria-label="Decrease"
        >
          <MinusIcon size={14} />
        </button>
        <div className="w-20 text-center">
          <input
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (isFinite(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-full h-9 text-center text-sm font-bold tabular-nums r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
          />
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 r-sm bg-[color:var(--surface-2)] hover:bg-[color:color-mix(in_oklab,var(--surface-2)_70%,var(--brand-2)_15%))] grid place-items-center transition-colors text-muted-foreground hover:text-[color:var(--brand-2)]"
          aria-label="Increase"
        >
          <PlusIcon size={14} />
        </button>
      </div>
    </div>
  );
}
