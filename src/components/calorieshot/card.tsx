"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  padded?: boolean;
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = "", hover = false, padded = true, glass = true, children, ...rest },
  ref
) {
  return (
    <motion.div
      ref={ref}
      className={[
        "r-lg",  /* 1.75rem standardized card radius */
        glass ? "glass" : "bg-[color:var(--surface)]",
        hover ? "transition-all hover:shadow-glow" : "",
        padded ? "p-5" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}
