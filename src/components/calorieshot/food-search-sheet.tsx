"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot } from "./provider";
import type { FoodDatabaseEntry } from "@/lib/db-calorieshot";
import { FoodIconByKey } from "./food-icon";
import { iconForFood } from "./icons";
import { SearchIcon, XIcon, ChevronRightIcon } from "./icons";

export function FoodSearchSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (entry: FoodDatabaseEntry) => void;
}) {
  const { searchFoods, foodDb } = useCalorieShot();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"all" | "ethiopian" | "international">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const list = searchFoods(query);
    if (region === "all") return list;
    return list.filter((f) => f.region === region);
  }, [searchFoods, query, region]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative mt-auto h-[85vh] bg-[color:var(--background)] rounded-t-[2rem] border-t border-[color:var(--line)] flex flex-col shadow-glow-strong"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
          >
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-[color:var(--line)]" />
            </div>

            <div className="px-5 pt-2 pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Add a <span className="text-gradient">food</span></h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[color:var(--surface-2)] grid place-items-center text-muted-foreground hover:bg-[color:var(--accent)] transition-colors"
                aria-label="Close"
              >
                <XIcon size={16} />
              </button>
            </div>

            <div className="px-5 pb-2">
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--brand-2)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search foods (injera, chicken, rice...)"
                  className="w-full h-11 pl-10 pr-4 text-sm r-sm border border-[color:var(--line)] bg-[color:var(--surface-2)] outline-none focus:border-[color:var(--brand-2)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--brand-2)_30%,transparent)]"
                />
              </div>
            </div>

            <div className="px-5 pb-3 flex items-center gap-2">
              {(["all", "ethiopian", "international"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={[
                    "text-[11px] font-medium px-2.5 py-1 rounded-full transition-all",
                    region === r
                      ? "bg-brand-gradient text-white shadow-glow"
                      : "glass text-foreground/70 hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))]",
                  ].join(" ")}
                >
                  {r === "all" ? "All" : r === "ethiopian" ? "Ethiopian" : "International"}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-muted-foreground">
                {foodDb.length} foods
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),1rem)] space-y-1.5">
              {results.length === 0 ? (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-2 text-[color:var(--brand-2)]">
                    <SearchIcon size={36} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium">No matches</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different name or category.</p>
                </div>
              ) : (
                results.map((f, i) => {
                  const Icon = iconForFood(f.id, f.category, f.region);
                  return (
                    <motion.button
                      key={f.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i, duration: 0.25 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onPick(f)}
                      className="w-full flex items-center gap-3 p-3 r-md glass hover:border-[color:color-mix(in_oklab,var(--brand-2)_30%,var(--line))] transition-colors text-left"
                    >
                      <div className="w-11 h-11 r-sm bg-brand-gradient-soft grid place-items-center text-[color:var(--brand-2)] shrink-0">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.per100g.calories} kcal/100g · {f.category}
                          {f.region === "ethiopian" ? " · ET" : ""}
                        </p>
                      </div>
                      <ChevronRightIcon size={18} className="text-[color:var(--brand-2)]" />
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
