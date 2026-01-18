"use client";

import { Section } from "@/components/ui/Section";
import { Sparkles } from "lucide-react";
import styles from "./Adab.module.css";
import { ImageSection } from "@/components/ImageSection/ImageSection";
import anneAsadCartoon4 from "../../../public/images/anne-asad-cartoon-4.jpg";

export function Adab() {
  return (
    <Section className={styles.section}>
      <ImageSection 
         src={anneAsadCartoon4}
         alt="Wedding Detail"
         className={`${styles.headerImage} mask-gradient-bottom`}
      />

      <div className={styles.container}>
        <div className={styles.iconWrapper}>
             <Sparkles className={styles.icon} />
        </div>
        
        <div className="space-y-6">
           <h2 className={styles.title}>Adab & Doa</h2>
           
           <div className={styles.text}>
            <p>
              Tanpa mengurangi rasa hormat, dimohon kepada Bapak/Ibu/Saudara/i tamu undangan agar berkenan hadir dengan berpakaian sopan dan menutup aurat.
            </p>
            
            <div className={styles.prayerContainer}>
              <p className={styles.prayerTitle}>Doa untuk Pengantin</p>
              <p className={styles.prayerArabic}>
              بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ 
              </p>
              <p className={styles.prayerTranslation}>
                "Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta mengumpulkan kalian berdua dalam kebaikan."
              </p>
            </div>
           </div>
        </div>
      </div>
    </Section>
  );
}
