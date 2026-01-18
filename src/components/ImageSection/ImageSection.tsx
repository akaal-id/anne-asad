"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./ImageSection.module.css";
import { cn } from "@/lib/utils";

interface ImageSectionProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}

export function ImageSection({ src, alt, className }: ImageSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={cn(styles.container, className)}>
      <motion.div style={{ y, height: "120%" }} className="w-full relative">
         <Image 
            src={src} 
            alt={alt} 
            fill
            className={styles.image}
            priority={false}
         />
         <div className={styles.overlay} />
      </motion.div>
    </div>
  );
}
