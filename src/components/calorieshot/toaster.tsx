"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCalorieShot } from "./provider";
import { CheckIcon, AlertIcon, InfoIcon } from "./icons";

export function Toaster() {
  const { toasts, dismissToast } = useCalorieShot();
  return (
    <div className="fixed inset-x-0 top-0 z-[60] px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pointer-events-none">
      <div className="mx-auto max-w-sm flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => dismissToast(t.id)}
              className="pointer-events-auto cursor-pointer r-md glass-strong shadow-glow px-4 py-3 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gradient" />
              <div className="flex items-start gap-3 pl-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {t.variant === "success" ? (
                      <div className="w-5 h-5 rounded-full bg-brand-gradient grid place-items-center text-white shrink-0">
                        <CheckIcon size={12} strokeWidth={3} />
                      </div>
                    ) : null}
                    {t.variant === "error" ? (
                      <div className="w-5 h-5 rounded-full bg-[color:var(--destructive)] grid place-items-center text-white shrink-0">
                        <AlertIcon size={12} strokeWidth={3} />
                      </div>
                    ) : null}
                    {t.variant === "info" ? (
                      <div className="w-5 h-5 rounded-full bg-brand-gradient grid place-items-center text-white shrink-0">
                        <InfoIcon size={12} strokeWidth={3} />
                      </div>
                    ) : null}
                    <p className="text-sm font-semibold leading-tight text-foreground">{t.title}</p>
                  </div>
                  {t.description ? (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
