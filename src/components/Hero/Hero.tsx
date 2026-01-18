"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import styles from "./Hero.module.css";

interface HeroProps {
  onOpen: () => void;
  isOpened: boolean;
  guestName?: string;
}

export function Hero({ onOpen, isOpened, guestName = "Bapak/Ibu/Saudara/i" }: HeroProps) {
  // If isOpened is true, we might want to hide this or change its style.
  // Usually the cover slides up.
  
  return (
    <motion.div
      className={cn(
        styles.hero,
        isOpened ? styles.heroOpen : styles.heroClosed
      )}
      initial={false}
      animate={isOpened ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className={styles.goldFrame} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={styles.contentWrapper}
      >
        <div className={styles.guestContainer}>
          <span className={styles.dearLabel}>Dear:</span>
          <span className={styles.guestName}>{guestName}</span>
        </div>

        <div className={styles.textGroup}>
          <p className={styles.subHeading}>The Wedding of</p>
          <h1 className={styles.heading}>
            Aulianne <br /> & <br /> Asad
          </h1>
        </div>

        <motion.div 
          className={styles.divider}
          initial={{ height: 0 }}
          animate={{ height: 64 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        <div className={styles.textGroup}>
          <p className={styles.date}>Saturday, 07 . 02 . 2026</p> {/* Placeholder date */}
        </div>

        <div className={styles.buttonWrapper}>
          <Button 
            onClick={onOpen}
            variant="outline" 
            className={styles.openButton}
          >
            Buka Undangan
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
