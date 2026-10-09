"use client";

import { motion } from "framer-motion";
import { useCalorieShot, type Route } from "./provider";
import {
  HomeIcon,
  HistoryIcon,
  StatsIcon,
  ProfileIcon,
  ScanIcon,
  SunIcon,
  MoonIcon,
} from "./icons";

interface NavItem {
  key: Route;
  label: string;
  Icon: typeof HomeIcon;
}

const items: NavItem[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "scan", label: "Scan Meal", Icon: ScanIcon },
  { key: "history", label: "History", Icon: HistoryIcon },
  { key: "analytics", label: "Insights", Icon: StatsIcon },
  { key: "profile", label: "Profile", Icon: ProfileIcon },
];

export function Sidebar() {
  const { route, navigate, theme, toggleTheme } = useCalorieShot();

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 z-30 px-4 py-6 glass-strong border-r border-[color:var(--line)]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-9 h-9 r-md bg-brand-gradient grid place-items-center shadow-glow">
          <div className="w-3 h-3 r-full bg-white" />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight leading-none">
            Calorie<span className="text-gradient">Shot</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Snap it. Know it. Track it.</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1">
        {items.map((it) => {
          const active = route === it.key;
          const Icon = it.Icon;
          return (
            <motion.button
              key={it.key}
              whileTap={{ scale: 0.97 }}
              whileHover={{ x: 2 }}
              onClick={() => navigate(it.key)}
              className={[
                "relative flex items-center gap-3 px-3 h-12 r-md text-left transition-colors",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-foreground/70 hover:text-foreground hover:bg-[color:var(--track)]",
              ].join(" ")}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{it.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Theme toggle at bottom */}
      <div className="pt-4 border-t border-[color:var(--line)]">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 h-12 r-md text-foreground/70 hover:text-foreground hover:bg-[color:var(--track)] transition-colors"
        >
          {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>
      </div>
    </aside>
  );
}
