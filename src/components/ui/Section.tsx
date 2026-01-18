"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function Section({ children, className, id, delay = 0 }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("w-full py-20 md:py-32 px-6 md:px-12 max-w-2xl mx-auto overflow-hidden", className)}
    >
      {children}
    </motion.section>
  );
}
