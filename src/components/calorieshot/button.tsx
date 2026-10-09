"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "accent" | "glass";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-white hover:brightness-110 shadow-glow",
  secondary:
    "bg-[color:var(--surface-2)] text-foreground border border-[color:var(--line)] hover:bg-[color:color-mix(in_oklab,var(--surface-2)_70%,var(--brand-2)_15%)]",
  ghost:
    "bg-transparent text-foreground hover:bg-[color:var(--track)]",
  outline:
    "bg-transparent text-foreground border border-[color:var(--line)] hover:border-[color:color-mix(in_oklab,var(--brand-2)_50%,var(--line))] hover:text-[color:var(--brand-2)]",
  danger:
    "bg-[color:var(--destructive)] text-white hover:opacity-90",
  accent:
    "bg-[color:var(--brand-3)] text-[color:var(--background)] hover:brightness-110 shadow-glow",
  glass:
    "glass text-foreground hover:bg-[color:color-mix(in_oklab,var(--surface)_85%,transparent)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs r-sm",
  md: "h-11 px-5 text-sm r-md",
  lg: "h-12 px-6 text-sm r-md",
  xl: "h-14 px-8 text-base r-lg",
  icon: "h-11 w-11 r-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, className = "", children, disabled, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={[
        "relative inline-flex items-center justify-center font-medium select-none whitespace-nowrap",
        "transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
      ) : null}
      <span className={`inline-flex items-center gap-2 ${loading ? "opacity-0" : ""}`}>{children}</span>
    </motion.button>
  );
});
