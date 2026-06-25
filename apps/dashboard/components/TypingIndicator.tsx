"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent shadow-sm"
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            type: "spring",
            duration: 0.3,
            bounce: 0,
            repeat: Infinity,
            repeatDelay: 0.6,
            delay: i * 0.1,
          }}
        />
      ))}
      <span className="text-[10px] text-muted-foreground ml-2 font-mono tabular-nums">
        Thinking...
      </span>
    </div>
  );
}
