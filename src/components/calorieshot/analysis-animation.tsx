"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DetectIcon,
  IdentifyIcon,
  PortionIcon,
  CalculateIcon,
  SparkleIcon,
  CheckIcon,
} from "./icons";

const STEPS = [
  { id: "detect", label: "Detecting food", Icon: DetectIcon },
  { id: "identify", label: "Identifying ingredients", Icon: IdentifyIcon },
  { id: "portion", label: "Estimating portions", Icon: PortionIcon },
  { id: "calc", label: "Calculating nutrition", Icon: CalculateIcon },
  { id: "prepare", label: "Preparing results", Icon: SparkleIcon },
];

export function AnalysisAnimation({ imageDataUrl }: { imageDataUrl: string }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(STEPS.length - 1, s + 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Image with scanning overlay */}
      <div className="relative w-52 h-52 r-xl overflow-hidden glass mb-6 shadow-glow">
        <img src={imageDataUrl} alt="" className="w-full h-full object-cover opacity-70" />

        {/* Gradient scan line */}
        <motion.div
          className="absolute inset-x-0 h-[3px] bg-brand-gradient"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 20px color-mix(in oklab, var(--brand-2) 80%, transparent), 0 0 40px color-mix(in oklab, var(--brand-3) 60%, transparent)" }}
        />
        <motion.div
          className="absolute inset-x-0 h-20 pointer-events-none"
          animate={{ top: ["-20%", "80%", "-20%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--brand-2) 30%, transparent), transparent)" }}
        />
        <div className="absolute inset-0 pointer-events-none bg-grid opacity-40" />
        {/* Corner brackets — using brand color not white */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[color:var(--brand-2)] rounded-tl-[1rem]" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-[color:var(--brand-2)] rounded-tr-[1rem]" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-[color:var(--brand-2)] rounded-bl-[1rem]" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[color:var(--brand-2)] rounded-br-[1rem]" />
      </div>

      <motion.h2
        className="text-xl font-bold tracking-tight mb-1 text-gradient"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        Analyzing your meal
      </motion.h2>
      <p className="text-xs text-muted-foreground mb-6">CalorieShot AI is on it.</p>

      {/* Steps */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {STEPS.map((step, i) => {
          const state = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
          const StepIcon = step.Icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={[
                "flex items-center gap-3 px-4 py-3 r-md border transition-colors duration-300",
                state === "active"
                  ? "border-[color:color-mix(in_oklab,var(--brand-2)_50%,var(--line))] bg-[color:var(--brand-soft-10)]"
                  : "border-[color:var(--line)] glass",
              ].join(" ")}
            >
              <div className="w-8 h-8 r-sm grid place-items-center shrink-0 relative">
                {state === "done" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="w-full h-full r-sm bg-brand-gradient grid place-items-center text-white"
                  >
                    <CheckIcon size={14} />
                  </motion.div>
                ) : state === "active" ? (
                  <div className="w-full h-full r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)]">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 rounded-full border-2 border-[color:var(--brand-2)] border-t-transparent"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full r-sm bg-[color:var(--surface-2)] grid place-items-center opacity-60 text-muted-foreground">
                    <StepIcon size={18} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${state === "pending" ? "text-muted-foreground" : ""}`}>
                  {step.label}
                </p>
              </div>
              {state === "active" ? (
                <motion.span
                  className="text-[10px] font-bold text-[color:var(--brand-2)] tabular-nums"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ANALYZING
                </motion.span>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
