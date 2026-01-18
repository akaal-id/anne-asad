"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import styles from "./Profile.module.css";

export function Profile() {
  return (
    <Section className={styles.section}>
      {/* Bride */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.profileContainer}
      >
        <div className={styles.imageContainer}>
             <div className={styles.imagePlaceholder}>A</div>
        </div>
        <h3 className={styles.name}>Aulianne Farah Anissa</h3>
        <div className={styles.details}>
          <p>Putri dari</p>
          <p><b>Alm. Galuh Septono Wahyudi, S. Sos</b></p>
          <p>&</p>
          <p><b>Arifa Kurniasari</b></p>
        </div>
      </motion.div>

      <div className={styles.divider}>&</div>

      {/* Groom */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={styles.profileContainer}
      >
         <div className={styles.imageContainer}>
            <div className={styles.imagePlaceholder}>A</div>
        </div>
        <h3 className={styles.name}>Asad Muhammad, S. Ip.</h3>
        <div className={styles.details}>
          <p>Putra dari</p>
          <p><b>Alm. Ir. Adrian</b></p>
          <p>&</p>
          <p><b>Sulistyowati, SS</b></p>
        </div>
      </motion.div>
    </Section>
  );
}
