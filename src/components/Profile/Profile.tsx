"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import anneAsadCartoon2 from "../../../public/images/anne-asad-cartoon-2.jpg";
import anneCartoon from "../../../public/images/anne-cartoon.jpg";
import asadCartoon from "../../../public/images/asad-cartoon.jpg";
import styles from "./Profile.module.css";

export function Profile() {
  return (
    <Section className={styles.section}>
      <div className={styles.headerImageContainer}>
        <Image 
          src={anneAsadCartoon2}
          alt="Couple Cartoon" 
          width={1200} 
          height={600}
          className={styles.headerImage}
          priority
        />
        <div className={styles.imageGradient}></div>
      </div>

      {/* Bride */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.profileContainer}
      >
        <div className={styles.imageContainer}>
             <Image 
               src={anneCartoon}
               alt="Aulianne Farah Anissa" 
               fill
               className={styles.profileImage}
             />
        </div>
        <h3 className={styles.name}>Aulianne Farah Anissa</h3>
        <a 
          href="https://instagram.com/auliannefr" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.instagramContainer}
        >
          <Instagram className={styles.instagramIcon} />
          <span className={styles.instagramHandle}>@auliannefr</span>
        </a>
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
            <Image 
               src={asadCartoon}
               alt="Asad Muhammad" 
               fill
               className={styles.profileImage}
             />
        </div>
        <h3 className={styles.name}>Asad Muhammad, S. Ip.</h3>
        <a 
          href="https://instagram.com/asadomu" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.instagramContainer}
        >
          <Instagram className={styles.instagramIcon} />
          <span className={styles.instagramHandle}>@asadomu</span>
        </a>
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
