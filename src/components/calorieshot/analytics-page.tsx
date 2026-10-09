"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCalorieShot } from "./provider";
import { Card, CardHeader } from "./card";
import {
  startOfDay,
  addDays,
  isSameDay,
  computeDailyTotals,
} from "@/lib/nutrition-utils";

type Range = "7d" | "14d" | "30d";

export function AnalyticsPage() {
  const { meals, goals } = useCalorieShot();
  const [range, setRange] = useState<Range>("7d");
  const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;

  const series = useMemo(() => {
    const today = startOfDay(new Date());
    const arr: { date: Date; calories: number; protein: number; carbs: number; fat: number; fiber: number; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = addDays(today, -i);
      const ms = meals.filter((m) => isSameDay(new Date(m.loggedAt), d));
      const t = computeDailyTotals(ms);
      arr.push({
        date: d,
        calories: t.calories,
        protein: t.protein,
        carbs: t.carbs,
        fat: t.fat,
        fiber: t.fiber,
        count: t.count,
      });
    }
    return arr;
  }, [meals, days]);

  const avgCalories = series.length > 0 ? Math.round(series.reduce((a, s) => a + s.calories, 0) / series.length) : 0;
  const maxCalories = Math.max(goals?.dailyCalories ?? 2200, ...series.map((s) => s.calories));
  const totalMeals = series.reduce((a, s) => a + s.count, 0);

  const macroAvg = useMemo(() => {
    const totalP = series.reduce((a, s) => a + s.protein, 0);
    const totalC = series.reduce((a, s) => a + s.carbs, 0);
    const totalF = series.reduce((a, s) => a + s.fat, 0);
    const totalFb = series.reduce((a, s) => a + s.fiber, 0);
    const sum = totalP + totalC + totalF + totalFb;
    return sum === 0
      ? { protein: 0, carbs: 0, fat: 0, fiber: 0 }
      : {
          protein: Math.round((totalP / sum) * 100),
          carbs: Math.round((totalC / sum) * 100),
          fat: Math.round((totalF / sum) * 100),
          fiber: Math.round((totalFb / sum) * 100),
        };
  }, [series]);

  const firstHalf = series.slice(0, Math.floor(series.length / 2));
  const secondHalf = series.slice(Math.floor(series.length / 2));
  const firstHalfAvg = firstHalf.length ? Math.round(firstHalf.reduce((a, s) => a + s.calories, 0) / firstHalf.length) : 0;
  const secondHalfAvg = secondHalf.length ? Math.round(secondHalf.reduce((a, s) => a + s.calories, 0) / secondHalf.length) : 0;
  const trendDelta = secondHalfAvg - firstHalfAvg;

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-32 lg:pb-12 max-w-2xl lg:max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><span className="text-gradient">Insights</span></h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your nutrition trends</p>
        </div>
      </div>

      {/* Range selector */}
      <div className="grid grid-cols-3 gap-1 p-1 glass r-md mb-4">
        {(["7d", "14d", "30d"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              "relative h-9 r-sm text-xs font-semibold transition-colors",
              range === r ? "text-white" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {range === r ? (
              <motion.span
                layoutId="range-pill"
                className="absolute inset-0 bg-brand-gradient r-sm shadow-glow"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            ) : null}
            <span className="relative z-10">{r === "7d" ? "7 days" : r === "14d" ? "14 days" : "30 days"}</span>
          </button>
        ))}
      </div>

      {/* Avg calories + meals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Avg / day</p>
          <p className="text-3xl font-bold tabular-nums mt-1 text-gradient">{avgCalories.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">kcal</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Meals</p>
          <p className="text-3xl font-bold tabular-nums mt-1 text-gradient">{totalMeals}</p>
          <p className="text-xs text-muted-foreground mt-0.5">logged in {days}d</p>
        </Card>
      </div>

      {/* Trend chart + Macro distribution — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Trend chart */}
      <Card className="mb-0">
        <CardHeader
          title="Daily calorie trend"
          subtitle={`Goal: ${(goals?.dailyCalories ?? 2200).toLocaleString()} kcal`}
          right={
            trendDelta !== 0 ? (
              <span
                className={[
                  "text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full",
                  trendDelta > 0
                    ? "bg-[color:var(--cal-soft)] text-[color:var(--cal)]"
                    : "bg-[color:var(--protein-soft)] text-[color:var(--protein)]",
                ].join(" ")}
              >
                {trendDelta > 0 ? "+" : ""}{trendDelta} kcal
              </span>
            ) : null
          }
        />
        <CalorieChart series={series} goal={goals?.dailyCalories ?? 2200} maxCalories={maxCalories} />
      </Card>

      {/* Macro distribution */}
      <Card className="mb-0">
        <CardHeader title="Macro distribution" subtitle="Avg over period" />
        <div className="flex items-center gap-4">
          <DonutChart
            segments={[
              { label: "Protein", value: macroAvg.protein, color: "var(--protein)" },
              { label: "Carbs", value: macroAvg.carbs, color: "var(--carbs)" },
              { label: "Fat", value: macroAvg.fat, color: "var(--fat)" },
              { label: "Fiber", value: macroAvg.fiber, color: "var(--fiber)" },
            ]}
          />
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2">
            <MacroLegend label="Protein" pct={macroAvg.protein} color="var(--protein)" />
            <MacroLegend label="Carbs" pct={macroAvg.carbs} color="var(--carbs)" />
            <MacroLegend label="Fat" pct={macroAvg.fat} color="var(--fat)" />
            <MacroLegend label="Fiber" pct={macroAvg.fiber} color="var(--fiber)" />
          </div>
        </div>
      </Card>
      </div>
      {/* end grid */}

      {/* Protein trend */}
      <Card>
        <CardHeader title="Protein intake" subtitle={`Goal: ${goals?.dailyProtein ?? 140} g`} />
        <ProteinChart series={series} goal={goals?.dailyProtein ?? 140} />
      </Card>
    </div>
  );
}

function CalorieChart({
  series,
  goal,
  maxCalories,
}: {
  series: { date: Date; calories: number }[];
  goal: number;
  maxCalories: number;
}) {
  const width = 320;
  const height = 140;
  const padding = { top: 10, right: 4, bottom: 18, left: 4 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const goalY = padding.top + innerH - (goal / maxCalories) * innerH;
  const barW = innerW / series.length;
  const showLabels = series.length <= 14;

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-2)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--brand-1)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="barGradOver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cal)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--cal)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Goal line */}
        <line x1={padding.left} x2={width - padding.right} y1={goalY} y2={goalY}
          stroke="color-mix(in oklab, var(--brand-3) 60%, transparent)" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={width - padding.right - 4} y={goalY - 4} textAnchor="end" fontSize="9" fill="var(--muted-foreground)">goal</text>
        {series.map((s, i) => {
          const h = (s.calories / maxCalories) * innerH;
          const x = padding.left + i * barW + barW * 0.15;
          const w = barW * 0.7;
          const y = padding.top + innerH - h;
          return (
            <motion.rect
              key={i}
              x={x}
              width={w}
              initial={{ height: 0, y: padding.top + innerH }}
              animate={{ height: Math.max(2, h), y }}
              transition={{ duration: 0.6, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
              rx={3}
              fill={s.calories >= goal ? "url(#barGradOver)" : "url(#barGrad)"}
            />
          );
        })}
        {showLabels
          ? series.map((s, i) => (
              <text key={i} x={padding.left + i * barW + barW / 2} y={height - 4} textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">
                {s.date.getDate()}
              </text>
            ))
          : null}
      </svg>
    </div>
  );
}

function ProteinChart({
  series,
  goal,
}: {
  series: { date: Date; protein: number }[];
  goal: number;
}) {
  const max = Math.max(goal, ...series.map((s) => s.protein), 1);
  const width = 320;
  const height = 100;
  const padding = { top: 8, right: 4, bottom: 16, left: 4 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = series
    .map((s, i) => {
      const x = padding.left + (i / Math.max(1, series.length - 1)) * innerW;
      const y = padding.top + innerH - (s.protein / max) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `${padding.left},${padding.top + innerH} ${points} ${padding.left + innerW},${padding.top + innerH}`;
  const goalY = padding.top + innerH - (goal / max) * innerH;

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
        <defs>
          <linearGradient id="proteinArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-2)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          points={areaPoints} fill="url(#proteinArea)" />
        <line x1={padding.left} x2={width - padding.right} y1={goalY} y2={goalY}
          stroke="color-mix(in oklab, var(--brand-3) 50%, transparent)" strokeWidth="1.5" strokeDasharray="3 3" />
        <motion.polyline
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          points={points} fill="none"
          stroke="url(#barGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--brand-2) 50%, transparent))" }}
        />
        {series.map((s, i) => {
          const x = padding.left + (i / Math.max(1, series.length - 1)) * innerW;
          const y = padding.top + innerH - (s.protein / max) * innerH;
          return (
            <motion.circle key={i} cx={x} cy={y} r={3}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.05 * i }}
              fill="var(--brand-2)" stroke="var(--background)" strokeWidth="1.5" />
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const size = 120;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  const computed = useMemo(() => {
    return segments.reduce<{ color: string; label: string; value: number; dash: number; startOffset: number }[]>(
      (acc, s) => {
        const pct = s.value / total;
        const dash = pct * circumference;
        const startOffset = acc.length > 0 ? acc[acc.length - 1].startOffset + acc[acc.length - 1].dash : 0;
        return [...acc, { ...s, dash, startOffset }];
      },
      []
    );
  }, [segments, total, circumference]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="var(--track)" strokeWidth={stroke} />
        {computed.map((s, i) => (
          <motion.circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: -s.startOffset }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 * i }}
            style={{ filter: `drop-shadow(0 0 4px color-mix(in oklab, ${s.color} 50%, transparent))` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums text-gradient">{total}%</span>
        <span className="text-[9px] text-muted-foreground">total</span>
      </div>
    </div>
  );
}

function MacroLegend({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] text-muted-foreground uppercase font-medium">{label}</span>
      <span className="ml-auto text-xs font-bold tabular-nums">{pct}%</span>
    </div>
  );
}
