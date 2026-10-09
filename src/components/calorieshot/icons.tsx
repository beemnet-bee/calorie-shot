"use client";

import { motion } from "framer-motion";

// ========================================
// CalorieShot Icon Library
// Every icon is hand-drawn SVG — no emoji, no font icons.
// ========================================

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const base = (size: number, className: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

// ============ UI / Navigation Icons ============

export function HomeIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function HistoryIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function StatsIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 3v18h18" />
      <path d="M8 16V10" />
      <path d="M13 16V7" />
      <path d="M18 16v-5" />
    </svg>
  );
}

export function ProfileIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function ScanIcon({ size = 26, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export function CameraIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M23 19V8a2 2 0 0 0-2-2h-3.2l-1.6-2.4a1 1 0 0 0-.8-.6H9.4a1 1 0 0 0-.8.6L7 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function UploadIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      <path d="M12 4v12" />
      <path d="M8 8l4-4 4 4" />
    </svg>
  );
}

export function SearchIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function RefreshIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function SparkleIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
      <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z" />
    </svg>
  );
}

export function CheckIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function XIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function AlertIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function InfoIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function PlusIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size = 22, className = "", strokeWidth = 2.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function EditIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function TrashIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function PencilIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Pen / write — used for manual entry
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
      <path d="M15 5l3 3" />
    </svg>
  );
}

export function SunIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function DownloadIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export function CalendarIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M3 10h18M8 2v4M16 2v4" />
      <circle cx="8" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <circle cx="16" cy="15" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function PlusCircleIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function TuneIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </svg>
  );
}

// ============ Meal Type Icons (replacing 🌅 ☀️ 🍎) ============

export function BreakfastIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Sun rising over horizon
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3a6 6 0 0 1 6 6h-6V3z" fill="currentColor" stroke="none" />
      <path d="M12 3a6 6 0 0 0-6 6 6 6 0 0 0 12 0" />
      <path d="M3 21h18" />
      <path d="M8 21l-1-2M16 21l1-2" />
    </svg>
  );
}

export function LunchIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Full sun
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function DinnerIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Crescent moon
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      <circle cx="20" cy="4" r="0.8" fill="currentColor" />
      <circle cx="4" cy="20" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function SnackIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Apple silhouette
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 7c-1.5-2-4-2-5.5-.5C5 8 5 11 6.5 13.5 8 16 10 18 12 18s4-2 5.5-4.5C19 11 19 8 17.5 6.5 16 5 13.5 5 12 7Z" />
      <path d="M12 7V5c0-1 .5-2 2-2.5" />
    </svg>
  );
}

// ============ Analysis Step Icons ============

export function DetectIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Magnifier over plate
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

export function IdentifyIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Leaf / ingredient
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 19 2 19 2s2 2 2 6.5c0 5-4 8-7.5 8.5-1.5.2-2.5.5-3.5 1z" />
      <path d="M2 22c2-3 4-5 7-7" />
    </svg>
  );
}

export function PortionIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Scale / balance
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3v18M5 21h14" />
      <path d="M3 7h18l-3 6H6z" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CalculateIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Calculator
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <circle cx="8.5" cy="11" r="0.5" fill="currentColor" />
      <circle cx="12" cy="11" r="0.5" fill="currentColor" />
      <circle cx="15.5" cy="11" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="15" r="0.5" fill="currentColor" />
      <circle cx="12" cy="15" r="0.5" fill="currentColor" />
      <circle cx="15.5" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

// ============ Food Icons (custom drawn) ============
// Each food in the database maps to one of these.

export function BowlIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Generic bowl — fallback
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 11h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 11c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <path d="M7 8c0-1 1-2 2-2M11 8c0-1 1-2 2-2M15 8c0-1 1-2 2-2" />
    </svg>
  );
}

export function FlatbreadIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Injera — large flat round with porous texture
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="14" rx="9" ry="3" />
      <ellipse cx="12" cy="13" rx="9" ry="3" />
      <circle cx="8" cy="13" r="0.4" fill="currentColor" />
      <circle cx="11" cy="12.5" r="0.4" fill="currentColor" />
      <circle cx="14" cy="13" r="0.4" fill="currentColor" />
      <circle cx="16" cy="12.5" r="0.4" fill="currentColor" />
      <circle cx="9.5" cy="13.5" r="0.4" fill="currentColor" />
      <circle cx="13" cy="13.5" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function StewIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Bowl of stew with steam
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 12c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <path d="M8 8c0-2 1-3 1-3M12 8c0-2 1-3 1-3M16 8c0-2 1-3 1-3" />
      <circle cx="9" cy="14" r="0.6" fill="currentColor" />
      <circle cx="13" cy="15" r="0.6" fill="currentColor" />
      <circle cx="15" cy="13" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function MeatPiecesIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Tibs / sauteed meat chunks
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 14c-1 1-1 3 0 4s3 1 4 0l4-4c1-1 1-3 0-4s-3-1-4 0z" />
      <path d="M14 6c-1-1-3-1-4 0s-1 3 0 4l5 5c1 1 3 1 4 0s1-3 0-4z" />
      <circle cx="9" cy="14" r="0.5" fill="currentColor" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function MincedMeatIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Kitfo — minced raw meat
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="13" rx="8" ry="5" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="13" cy="11" r="0.8" fill="currentColor" />
      <circle cx="15" cy="14" r="0.8" fill="currentColor" />
      <circle cx="11" cy="14" r="0.8" fill="currentColor" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function ShreddedIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Firfir — shredded injera with sauce
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      <path d="M3 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      <path d="M3 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
    </svg>
  );
}

export function LentilsIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Lentil stew — small round dots in bowl
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 12c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <circle cx="9" cy="14" r="0.7" fill="currentColor" />
      <circle cx="12" cy="13" r="0.7" fill="currentColor" />
      <circle cx="15" cy="14" r="0.7" fill="currentColor" />
      <circle cx="10.5" cy="15.5" r="0.7" fill="currentColor" />
      <circle cx="13.5" cy="15.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function GreensIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Gomen — collard greens / kale
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M6 4c4 0 6 2 6 6 0 4-2 6-6 6 0-4 0-8 0-12z" />
      <path d="M18 4c-4 0-6 2-6 6 0 4 2 6 6 6 0-4 0-8 0-12z" />
      <path d="M12 10v10" />
    </svg>
  );
}

export function MixedVegIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Atakilt — mixed vegetables
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="9" cy="12" r="3" />
      <circle cx="15" cy="12" r="3" />
      <circle cx="12" cy="16" r="3" />
      <path d="M9 9c0-2 1-3 3-3M15 9c0-2-1-3-3-3" />
    </svg>
  );
}

export function PlatterIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Beyainatu — large platter with multiple foods
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <circle cx="8" cy="11" r="1.2" fill="currentColor" />
      <circle cx="12" cy="10" r="1.2" fill="currentColor" />
      <circle cx="16" cy="11" r="1.2" fill="currentColor" />
      <circle cx="10" cy="14" r="1.2" fill="currentColor" />
      <circle cx="14" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function RiceIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 12c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <circle cx="8" cy="13" r="0.6" fill="currentColor" />
      <circle cx="11" cy="13" r="0.6" fill="currentColor" />
      <circle cx="14" cy="13" r="0.6" fill="currentColor" />
      <circle cx="9.5" cy="15" r="0.6" fill="currentColor" />
      <circle cx="12.5" cy="15" r="0.6" fill="currentColor" />
      <circle cx="15.5" cy="15" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ChickenIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Drumstick
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M14 4a5 5 0 0 1 5 5c0 2-1 3-3 4l-7 7c-1 1-3 1-4 0s-1-3 0-4l7-7c1-2 2-3 4-3z" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export function PastaIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 8c4-2 10-2 14 0M5 12c4-2 10-2 14 0M5 16c4-2 10-2 14 0" />
      <path d="M3 6h18v12H3z" opacity="0.3" />
    </svg>
  );
}

export function BeefIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Steak
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 8c2-2 6-2 8 0s6 2 8 0v8c-2 2-6 2-8 0s-6-2-8 0z" />
      <path d="M9 10c1 1 1 3 0 4M14 10c1 1 1 3 0 4" />
    </svg>
  );
}

export function SaladIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 12c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <path d="M8 9c0-1 1-2 2-2M12 9V7M16 9c0-1-1-2-2-2" />
    </svg>
  );
}

export function BroccoliIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="8" cy="9" r="2" />
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <circle cx="10" cy="11" r="2" />
      <circle cx="14" cy="11" r="2" />
      <path d="M12 13v8M10 18h4" />
    </svg>
  );
}

export function SauceIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M10 2h4v3l2 3v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8l2-3z" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function AvocadoIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3c-3 0-5 3-5 7s2 11 5 11 5-7 5-11-2-7-5-7z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function BananaIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 4c0 8 4 14 14 16 0-2-2-4-2-4s-8-2-10-12z" />
      <path d="M5 4c0 1 1 2 2 2" />
    </svg>
  );
}

export function AppleIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 7c-1.5-2-4-2-5.5-.5C5 8 5 11 6.5 13.5 8 16 10 18 12 18s4-2 5.5-4.5C19 11 19 8 17.5 6.5 16 5 13.5 5 12 7Z" />
      <path d="M12 7V5c0-1 .5-2 2-2.5" />
    </svg>
  );
}

export function EggIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="13" rx="5" ry="7" />
    </svg>
  );
}

export function BreadIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 12c0-4 4-7 8-7s8 3 8 7v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M8 12v7M12 12v7M16 12v7" />
    </svg>
  );
}

export function FishIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12c4-5 9-5 13 0-4 5-9 5-13 0z" />
      <path d="M16 12l5-3v6z" />
      <circle cx="7" cy="11" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function DairyIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Yogurt / milk carton
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M8 3h8l-1 3v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V6z" />
      <path d="M8 3l1 3h6l1-3" />
      <path d="M11 13h2" />
    </svg>
  );
}

export function OatmealIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
      <path d="M3 12c0-1 1-2 2-2h14c1 0 2 1 2 2" />
      <circle cx="9" cy="14" r="0.5" fill="currentColor" />
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
      <circle cx="15" cy="14" r="0.5" fill="currentColor" />
      <circle cx="11" cy="16" r="0.5" fill="currentColor" />
      <circle cx="14" cy="16" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function FriesIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 14h14l-1 6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
      <path d="M8 14V8M11 14V6M14 14V8M17 14V10" />
    </svg>
  );
}

export function CheeseIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 16l9-12 9 12v4H3z" />
      <circle cx="9" cy="14" r="0.8" fill="currentColor" />
      <circle cx="14" cy="15" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function OilIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Olive oil bottle
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M10 3h4v3c0 1 2 2 2 4v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10c0-2 2-3 2-4z" />
      <path d="M10 3h4" />
      <path d="M9 14h6" />
    </svg>
  );
}

export function CoffeeIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 8h14v6a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z" />
      <path d="M18 9h2a3 3 0 0 1 0 6h-2" />
      <path d="M8 4c0-1 1-1 1 0M12 4c0-1 1-1 1 0M16 4c0-1 1-1 1 0" />
    </svg>
  );
}

// ============ Additional food icons (dough, grain, drink) ============

export function DoughIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Genfo / Bulla / Tihlo — dough-like mass
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="12" cy="14" rx="8" ry="5" />
      <ellipse cx="12" cy="13" rx="6" ry="3" opacity="0.6" />
      <circle cx="10" cy="13" r="0.6" fill="currentColor" />
      <circle cx="13" cy="13" r="0.6" fill="currentColor" />
      <circle cx="11" cy="14.5" r="0.6" fill="currentColor" />
      <circle cx="14" cy="14.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function GrainIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Kollo / Dabo Kolo — roasted grains
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <ellipse cx="8" cy="8" rx="2" ry="3" transform="rotate(-30 8 8)" />
      <ellipse cx="14" cy="10" rx="2" ry="3" transform="rotate(20 14 10)" />
      <ellipse cx="10" cy="14" rx="2" ry="3" transform="rotate(-15 10 14)" />
      <ellipse cx="15" cy="16" rx="2" ry="3" transform="rotate(40 15 16)" />
      <ellipse cx="6" cy="14" rx="2" ry="3" transform="rotate(-50 6 14)" />
    </svg>
  );
}

export function DrinkIcon({ size = 28, className = "", strokeWidth = 2 }: IconProps) {
  // Atmet / Coffee — cup with steam
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 8h14v6a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6z" />
      <path d="M19 9h2a3 3 0 0 1 0 6h-2" />
      <path d="M9 4c0-1 .5-1.5 1-2M12 4c0-1 .5-1.5 1-2M15 4c0-1 .5-1.5 1-2" />
    </svg>
  );
}

// ============ Diet preference icons ============

export function NoPrefIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function VegIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13c2-2 4-2 6 0s4 2 6 0" />
      <path d="M12 8v8" />
    </svg>
  );
}

export function VeganIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 19 2 19 2s2 2 2 6.5c0 5-4 8-7.5 8.5-1.5.2-2.5.5-3.5 1z" />
      <path d="M2 22c2-3 4-5 7-7" />
    </svg>
  );
}

export function HalalIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Crescent
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function KetoIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  // Avocado (keto friendly)
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3c-2 0-4 3-4 6s2 11 4 11 4-8 4-11-2-6-4-6z" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}

export function PescatarianIcon({ size = 22, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M3 12c4-5 9-5 13 0-4 5-9 5-13 0z" />
      <path d="M16 12l5-3v6z" />
      <circle cx="7" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

// ============ Empty state icon ============

export function EmptyPlateIcon({ size = 48, className = "", strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
}

// ============ Brand mark ============

export function BrandMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="50%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-3)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#brandGrad)" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4" fill="url(#brandGrad)" />
      <path d="M12 3L14 9L20 9L15 13L17 19L12 16L7 19L9 13L4 9L10 9z" fill="none" stroke="url(#brandGrad)" strokeWidth="1.5" opacity="0" />
    </svg>
  );
}

// ============ Loader ============

export function SpinnerIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}

// ============ Food icon registry ============
// Maps food database id -> specific icon

import type { ComponentType } from "react";

export const FOOD_ICONS: Record<string, ComponentType<IconProps>> = {
  // Ethiopian
  "injera": FlatbreadIcon,
  "doro-wot": StewIcon,
  "shiro": StewIcon,
  "tibs": MeatPiecesIcon,
  "kitfo": MincedMeatIcon,
  "firfir": ShreddedIcon,
  "misir-wot": LentilsIcon,
  "gomen": GreensIcon,
  "atakilt": MixedVegIcon,
  "kik-wot": LentilsIcon,
  "beyainatu": PlatterIcon,
  // International
  "white-rice": RiceIcon,
  "grilled-chicken-breast": ChickenIcon,
  "pasta": PastaIcon,
  "beef-steak": BeefIcon,
  "salad-(mixed-greens)": SaladIcon,
  "broccoli": BroccoliIcon,
  "tomato-sauce": SauceIcon,
  "avocado": AvocadoIcon,
  "banana": BananaIcon,
  "apple": AppleIcon,
  "egg-(boiled)": EggIcon,
  "bread-(white)": BreadIcon,
  "salmon-(grilled)": FishIcon,
  "yogurt-(plain)": DairyIcon,
  "oatmeal": OatmealIcon,
  "french-fries": FriesIcon,
  "cheese-(cheddar)": CheeseIcon,
  "olive-oil": OilIcon,
  "coffee-(black)": CoffeeIcon,
};

// Generic food icon by category
export function iconForFood(id: string, category?: string, region?: string): ComponentType<IconProps> {
  if (FOOD_ICONS[id]) return FOOD_ICONS[id];
  // Fallback by category
  const cat = (category ?? "").toLowerCase();
  if (cat.includes("stew")) return StewIcon;
  if (cat.includes("bread")) return BreadIcon;
  if (cat.includes("grain")) return RiceIcon;
  if (cat.includes("meat")) return BeefIcon;
  if (cat.includes("fish")) return FishIcon;
  if (cat.includes("vegetable")) return MixedVegIcon;
  if (cat.includes("fruit")) return AppleIcon;
  if (cat.includes("dairy")) return DairyIcon;
  if (cat.includes("sauce")) return SauceIcon;
  if (cat.includes("oil")) return OilIcon;
  if (cat.includes("drink")) return CoffeeIcon;
  return BowlIcon;
}

// Map meal type to icon
export const MEAL_TYPE_ICONS = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
  unknown: BowlIcon,
} as const;

// Map diet preference to icon
export const DIET_ICONS = {
  none: NoPrefIcon,
  vegetarian: VegIcon,
  vegan: VeganIcon,
  halal: HalalIcon,
  keto: KetoIcon,
  pescatarian: PescatarianIcon,
} as const;
