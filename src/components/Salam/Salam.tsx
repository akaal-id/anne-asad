"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Salam.module.css";

export function Salam() {
  return (
    <Section className={styles.section}>
      <div className={styles.imageContainer}>
        {/* Placeholder image - replace src with your actual image */}
        <Image 
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2000&auto=format&fit=crop" 
          alt="Couple Photo" 
          width={1200} 
          height={600}
          className={styles.image}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={styles.bismillah}
      >
        بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيم
      </motion.div>

      <div className={styles.greetingContainer}>
        <h2 className={styles.greetingTitle}>
        ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللهِ وَبَرَكَاتُهُ
        </h2>
        
        <p className={styles.greetingText}>
          Dengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
        </p>
      </div>

      <div className={styles.verseContainer}>
        <p className={styles.verseText}>
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang..."
        </p>
        <p className={styles.verseReference}>
          QS. Ar-Rum: 21
        </p>
      </div>
    </Section>
  );
}
