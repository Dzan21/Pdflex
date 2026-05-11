"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";

type Props = React.PropsWithChildren<{
  y?: number;          // vertikálny offset pri vstupe
  delay?: number;      // ms
  once?: boolean;      // false => objavuje sa/mizne vždy
  blur?: number;       // px počiatočný blur (default 10)
  scaleFrom?: number;  // počiatočný scale (default 0.985)
  duration?: number;   // s (default 0.9)
}>;

export default function Reveal({
  children,
  y = 14,
  delay = 0,
  once = false,
  blur = 10,
  scaleFrom = 0.985,
  duration = 0.9,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  // trochu väčšie „okno“ + amount 0.25 pre plynulejší trigger
  const inView = useInView(ref, {
    margin: "-15% 0px -15% 0px",
    amount: 0.25,
    once,
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {
          opacity: 0,
          y,
          scale: scaleFrom,
          filter: `blur(${blur}px) saturate(0.92)`,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px) saturate(1)",
        },
      }}
      transition={{
        duration,
        delay: delay / 1000,
        // super-smooth ease (podobné iOS spring bez overshootu)
        ease: [0.16, 1, 0.3, 1],
      }}
      // GPU hint
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}