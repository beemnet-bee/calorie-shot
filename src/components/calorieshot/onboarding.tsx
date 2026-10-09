"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot, type Goals } from "./provider";
import { Button } from "./button";
import { CameraIcon, SparkleIcon, StatsIcon } from "./icons";

const SLIDES = [
  {
    Icon: CameraIcon,
    title: "Snap it.",
    desc: "Take or upload a photo of your meal — no measuring, no typing.",
  },
  {
    Icon: SparkleIcon,
    title: "Know it.",
    desc: "CalorieShot AI detects every ingredient and estimates portions, calories, and macros in seconds.",
  },
  {
    Icon: StatsIcon,
    title: "Track it.",
    desc: "Save meals, watch your daily nutrition update, and stay on top of your goals — all in one place.",
  },
];

const PRESETS = [
  { label: "Cut", cal: 1800, p: 160, c: 160, f: 60, fb: 35, tagline: "Lose weight" },
  { label: "Maintain", cal: 2200, p: 140, c: 250, f: 70, fb: 30, tagline: "Stay fit" },
  { label: "Bulk", cal: 2800, p: 180, c: 340, f: 90, fb: 35, tagline: "Build muscle" },
];

export function Onboarding() {
  const { setOnboarded, saveGoals, goals, navigate } = useCalorieShot();
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = async (g: Goals) => {
    await saveGoals(g);
    setOnboarded(true);
    navigate("home");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),1rem)] max-w-md mx-auto">
      {/* Logo + progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 r-sm bg-brand-gradient grid place-items-center shadow-glow">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="text-base font-bold tracking-tight">Calorie<span className="text-gradient">Shot</span></span>
        </div>
        {step < 3 ? (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-brand-gradient" : i < step ? "w-2 bg-[color:var(--brand-2)]/60" : "w-2 bg-[color:var(--track)]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div
              key={`slide-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
              {/* Gradient hero orb with icon */}
              <motion.div
                key={step}
                initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                className="relative mb-8"
              >
                {/* Outer glow */}
                <div className="absolute inset-0 -m-8 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
                {/* Gradient ring with icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="relative w-32 h-32 r-2xl bg-brand-gradient grid place-items-center shadow-glow-strong text-white"
                >
                  {(() => {
                    const SlideIcon = SLIDES[step].Icon;
                    return <SlideIcon size={56} />;
                  })()}
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold tracking-tight mb-3 text-gradient"
              >
                {SLIDES[step].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground max-w-[280px] leading-relaxed"
              >
                {SLIDES[step].desc}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1"
            >
              <GoalSetup initial={goals} onDone={finish} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 3 ? (
        <div className="grid gap-2 pt-6">
          {step === 0 ? (
            <Button variant="ghost" size="md" fullWidth onClick={() => setStep(3)}>
              Skip intro →
            </Button>
          ) : null}
          <Button size="lg" fullWidth onClick={next}>
            {step === 2 ? "Set my goals" : "Continue"}
          </Button>
          {step > 0 ? (
            <Button variant="ghost" size="md" fullWidth onClick={prev}>
              Back
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function GoalSetup({
  initial,
  onDone,
}: {
  initial: Goals | null;
  onDone: (g: Goals) => Promise<void> | void;
}) {
  const [cal, setCal] = useState(initial?.dailyCalories ?? 2200);
  const [protein, setProtein] = useState(initial?.dailyProtein ?? 140);
  const [carbs, setCarbs] = useState(initial?.dailyCarbs ?? 250);
  const [fat, setFat] = useState(initial?.dailyFat ?? 70);
  const [fiber, setFiber] = useState(initial?.dailyFiber ?? 30);

  const apply = (p: typeof PRESETS[number]) => {
    setCal(p.cal);
    setProtein(p.p);
    setCarbs(p.c);
    setFat(p.f);
    setFiber(p.fb);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold tracking-tight mb-1">Set your <span className="text-gradient">goals</span></h2>
      <p className="text-sm text-muted-foreground mb-5">You can adjust these anytime.</p>

      {/* Quick presets */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-2">Quick preset</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PRESETS.map((p) => {
          const active = cal === p.cal;
          return (
            <button
              key={p.label}
              onClick={() => apply(p)}
              className={[
                "p-3 r-md border text-center transition-all",
                active
                  ? "bg-brand-gradient text-white border-transparent shadow-glow"
                  : "glass text-foreground hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{p.label}</p>
              <p className={`text-[10px] mt-0.5 ${active ? "text-white/70" : "text-muted-foreground"}`}>{p.tagline}</p>
              <p className={`text-xs font-bold mt-1.5 tabular-nums ${active ? "text-white" : "text-gradient"}`}>{p.cal}</p>
              <p className={`text-[9px] ${active ? "text-white/60" : "text-muted-foreground"}`}>kcal</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-1">
        <Slider label="Daily calories" value={cal} min={1000} max={4000} step={50} unit="kcal" onChange={setCal} color="var(--cal)" />
        <Slider label="Protein" value={protein} min={40} max={300} step={5} unit="g" onChange={setProtein} color="var(--protein)" />
        <Slider label="Carbs" value={carbs} min={50} max={500} step={5} unit="g" onChange={setCarbs} color="var(--carbs)" />
        <Slider label="Fat" value={fat} min={20} max={150} step={2} unit="g" onChange={setFat} color="var(--fat)" />
        <Slider label="Fiber" value={fiber} min={10} max={60} step={1} unit="g" onChange={setFiber} color="var(--fiber)" />
      </div>

      <div className="mt-auto pt-6">
        <Button
          size="lg"
          fullWidth
          onClick={() =>
            onDone({
              id: "default",
              dailyCalories: cal,
              dailyProtein: protein,
              dailyCarbs: carbs,
              dailyFat: fat,
              dailyFiber: fiber,
              activityLevel: "moderate",
              dietaryPreference: "none",
              onboardedAt: Date.now(),
              updatedAt: Date.now(),
            })
          }
        >
          Start tracking
        </Button>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold tabular-nums text-gradient">
          {value}
          <span className="text-[10px] text-muted-foreground ml-1 font-normal">{unit}</span>
        </span>
      </div>
      <div className="relative h-9 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-[color:var(--track)]" />
        <div
          className="absolute h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px color-mix(in oklab, ${color} 50%, transparent)` }}
        />
        <div
          className="absolute w-5 h-5 rounded-full bg-[color:var(--surface)] border-2 shadow-glow -translate-x-1/2"
          style={{ left: `${pct}%`, borderColor: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
}
