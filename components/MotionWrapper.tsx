"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export function MotionWrapper({ children, delay = 0, className, ...props }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
