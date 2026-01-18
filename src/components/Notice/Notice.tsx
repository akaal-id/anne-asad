"use client";

import { Section } from "@/components/ui/Section";
import styles from "./Notice.module.css";
import { cn } from "@/lib/utils";

export function Notice() {
  return (
    <Section className={styles.section}>
      <div className={styles.card}>
        <p className={styles.text}>
          Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
        </p>
        <p className={cn(styles.text, styles.italic)}>
          Tanpa mengurangi rasa hormat, sehubungan dengan keterbatasan tempat, kami memohon maaf apabila undangan ini hanya kami tujukan kepada tamu yang tertera namanya di undangan ini.
        </p>
        <p className={styles.closing}>
          Terima Kasih atas pengertian Anda.
        </p>
      </div>
    </Section>
  );
}
