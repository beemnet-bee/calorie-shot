"use client";

import { motion } from "framer-motion";
import { useCalorieShot, type Route } from "./provider";

interface NavItem {
  key: Route;
  label: string;
  icon: React.ReactNode;
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const HOME_ICON = "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z";
const HISTORY_ICON = "M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 8v4l3 2";
const ANALYTICS_ICON = "M3 3v18h18M8 16V10M13 16V7M18 16v-5";
const PROFILE_ICON = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0";

const items: NavItem[] = [
  { key: "home", label: "Home", icon: <Icon d={HOME_ICON} /> },
  { key: "history", label: "History", icon: <Icon d={HISTORY_ICON} /> },
  { key: "scan", label: "Scan", icon: null },
  { key: "analytics", label: "Stats", icon: <Icon d={ANALYTICS_ICON} /> },
  { key: "profile", label: "Profile", icon: <Icon d={PROFILE_ICON} /> },
];

export function BottomNav() {
  const { route, navigate } = useCalorieShot();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none lg:hidden">
      <div className="mx-auto max-w-2xl px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pointer-events-auto">
        <nav className="relative grid grid-cols-5 items-center gap-1 px-2 h-[68px] r-lg glass-strong shadow-lifted">
          {items.slice(0, 2).map((it) => (
            <NavButton key={it.key} item={it} active={route === it.key} onClick={() => navigate(it.key)} />
          ))}

          {/* Center Scan button — emphasized with gradient + glow */}
          <div className="relative flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={() => navigate("scan")}
              className="absolute -top-7 w-16 h-16 rounded-full grid place-items-center text-white shadow-glow-strong bg-brand-gradient"
              aria-label="Scan meal"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ["0 0 0 0 color-mix(in oklab, var(--brand-2) 50%, transparent)", "0 0 0 16px color-mix(in oklab, var(--brand-2) 0%, transparent)"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="12" cy="12" r="3.5" />
              </svg>
            </motion.button>
            <span className="text-[10px] font-medium text-muted-foreground mt-9">Scan</span>
          </div>

          {items.slice(3).map((it) => (
            <NavButton key={it.key} item={it} active={route === it.key} onClick={() => navigate(it.key)} />
          ))}
        </nav>
      </div>
    </div>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 text-foreground/60"
      aria-label={item.label}
    >
      {active ? (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute -top-0.5 w-10 h-0.5 rounded-full bg-brand-gradient"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ) : null}
      <span className={active ? "text-[color:var(--brand-2)]" : ""}>{item.icon}</span>
      <span className={`text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {item.label}
      </span>
    </motion.button>
  );
}
