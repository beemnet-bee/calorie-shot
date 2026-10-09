"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useId } from "react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;            // single color (CSS var or hex)
  gradient?: boolean;        // use brand gradient instead of single color
  trackColor?: string;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  showPercent?: boolean;
  className?: string;
  animateCount?: boolean;
}

export function ProgressRing({
  value,
  max,
  size = 132,
  strokeWidth = 10,
  color = "var(--brand-2)",
  gradient = false,
  trackColor = "var(--track)",
  label,
  sublabel,
  showPercent = false,
  className = "",
  animateCount = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const gradId = useId();

  const dashOffset = useMotionValue(circumference);
  const targetOffset = circumference * (1 - pct);

  useEffect(() => {
    const controls = animate(dashOffset, targetOffset, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [targetOffset, dashOffset]);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, count]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          {gradient ? (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-1)" />
              <stop offset="50%" stopColor="var(--brand-2)" />
              <stop offset="100%" stopColor="var(--brand-3)" />
            </linearGradient>
          ) : null}
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradient ? `url(#${gradId})` : color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset, filter: gradient ? "drop-shadow(0 0 8px color-mix(in oklab, var(--brand-2) 50%, transparent))" : undefined }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ?? (
          <>
            <motion.span className="text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
              {animateCount ? (
                <motion.span>{rounded}</motion.span>
              ) : (
                <>{Math.round(value).toLocaleString()}</>
              )}
            </motion.span>
            {showPercent ? (
              <span className="text-[11px] text-muted-foreground mt-0.5">{Math.round(pct * 100)}%</span>
            ) : (
              <span className="text-[11px] text-muted-foreground mt-0.5">
                / {Math.round(max).toLocaleString()}
              </span>
            )}
          </>
        )}
        {sublabel ? <span className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</span> : null}
      </div>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color?: string;
  emoji?: string;
  compact?: boolean;
  gradient?: boolean;
}

export function MacroBar({
  label,
  value,
  max,
  unit = "g",
  color = "var(--protein)",
  emoji,
  compact = false,
  gradient = false,
}: MacroBarProps) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v * 10) / 10);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, count]);

  return (
    <div className={compact ? "py-1.5" : "py-2"}>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {emoji ? <span className="text-sm">{emoji}</span> : null}
          <span className={compact ? "text-xs font-medium" : "text-sm font-medium"}>{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span className={compact ? "text-xs font-semibold tabular-nums" : "text-sm font-semibold tabular-nums"}>
            {rounded}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ {Math.round(max * 10) / 10} {unit}</span>
        </div>
      </div>
      <div className={`w-full rounded-full bg-[color:var(--track)] overflow-hidden ${compact ? "h-1.5" : "h-2"}`}>
        <motion.div
          className={`h-full rounded-full ${gradient ? "bg-brand-gradient" : ""}`}
          style={gradient ? undefined : { background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
