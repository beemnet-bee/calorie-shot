"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCalorieShot } from "./provider";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { Toaster } from "./toaster";
import { Onboarding } from "./onboarding";
import { HomePage } from "./home-page";
import { ScanPage } from "./scan-page";
import { HistoryPage } from "./history-page";
import { AnalyticsPage } from "./analytics-page";
import { ProfilePage } from "./profile-page";
import { SunIcon, MoonIcon } from "./icons";

export function CalorieShotApp() {
  const { ready, onboarded, route, online, theme, toggleTheme } = useCalorieShot();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 700);
    return () => clearTimeout(t);
  }, []);

  if (!ready || !booted) return <Splash />;

  if (!onboarded) {
    return (
      <>
        <Onboarding />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {!online ? <OfflineBanner /> : null}
      {/* Sidebar nav — desktop only */}
      <Sidebar />
      {/* Floating theme toggle — mobile only (history/analytics/profile pages) */}
      <FloatingThemeToggle theme={theme} onToggle={toggleTheme} route={route} />
      <main className="flex-1 lg:pl-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {route === "home" && <HomePage />}
            {route === "scan" && <ScanPage />}
            {route === "history" && <HistoryPage />}
            {route === "analytics" && <AnalyticsPage />}
            {route === "profile" && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
}

function FloatingThemeToggle({
  theme,
  onToggle,
  route,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
  route: string;
}) {
  // Mobile only — sidebar has its own toggle on desktop
  // Don't render on home (header has its own toggle) or scan (camera focus)
  if (route === "home" || route === "scan") return null;
  return (
    <button
      onClick={onToggle}
      className="lg:hidden fixed top-[max(env(safe-area-inset-top),1rem)] right-4 z-30 w-10 h-10 r-md glass-strong grid place-items-center text-foreground hover:text-[color:var(--brand-2)] transition-colors shadow-soft"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}

function Splash() {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[color:var(--background)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="relative w-24 h-24 r-xl bg-brand-gradient grid place-items-center mb-5 shadow-glow-strong"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 r-xl"
          animate={{ boxShadow: ["0 0 0 0 color-mix(in oklab, var(--brand-2) 60%, transparent)", "0 0 0 24px color-mix(in oklab, var(--brand-2) 0%, transparent)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="w-10 h-10 r-full border-[3px] border-white/30 border-t-white"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold tracking-tight"
      >
        Calorie<span className="text-gradient">Shot</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs text-muted-foreground mt-1"
      >
        Snap it. Know it. Track it.
      </motion.p>
    </motion.div>
  );
}

function OfflineBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className="sticky top-0 z-30 px-4 py-2 bg-brand-gradient text-white text-xs text-center font-medium safe-top shadow-glow"
    >
      You&apos;re offline. Saved meals are available — AI scanning needs a connection.
    </motion.div>
  );
}
