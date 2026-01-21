"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Events.module.css";
import masjidAnNoor from "../../../public/images/masjid-an-noor.jpg";

export function Events() {
  return (
    <Section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Rangkaian Acara</h2>
        <div className={styles.divider}></div>
      </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      className={styles.card}
    >
        <div className={styles.dateContainer}>
           <p className={styles.bigDate}>Sabtu<br />7 Februari 2026</p>
        </div>
        
        <div className={styles.eventGrid}>
           <div className={styles.eventItem}>
              <h3 className={styles.eventTitle}>Akad Nikah</h3>
              <div className={styles.timeWrapper}>
                <Clock className={styles.icon} />
                <p className={styles.time}>09.00 - 11.00 WIB</p>
              </div>
              <div className={styles.liveStreamInfo}>
                <Instagram className={styles.instagramIcon} />
                <p className={styles.liveStreamText}>akan disiarkan live di akun instagram <a href="https://instagram.com/auliannefr" target="_blank" rel="noopener noreferrer" className={styles.instagramHandle}>@auliannefr</a> & <a href="https://instagram.com/asadomu" target="_blank" rel="noopener noreferrer" className={styles.instagramHandle}>@asadomu</a></p>
              </div>
           </div>
           <div className={styles.eventItem}>
              <h3 className={styles.eventTitle}>Tasyakuran</h3>
              <div className={styles.timeWrapper}>
          <Clock className={styles.icon} />
                <p className={styles.time}>11.00 - 13.00 WIB</p>
              </div>
           </div>
        </div>
        
         <div className={styles.locationContainer}>
         <div className={styles.mosqueImageContainer}>
              <Image 
                src={masjidAnNoor}
                alt="Masjid An Noor, Ciputat" 
                fill
                className={styles.mosqueImage}
              />
            </div>

          <MapPin className={styles.icon} />
          <p className={styles.locationName}>Masjid An-Noor</p>
          <p className={styles.address}>Jl. RE Martadinata No.60, Cipayung, Kec. Ciputat, Kota Tangerang Selatan, Banten 15411</p>
      </div>

      <div className="space-y-4">
        <div className={styles.mapContainer}>
           <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5123517517986!2d106.74498027570735!3d-6.327588961916442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69efb1eb34cae7%3A0x1e571996819f743c!2sJami&#39;%20An-Noor%20Ciputat%20Mosque!5e0!3m2!1sen!2sid!4v1768714046567!5m2!1sen!2sid"
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy"
             className={styles.iframe}
                 title="Map to Masjid Jami's An-Noor Ciputat"
           ></iframe>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
              className={styles.mapButton}
              onClick={() => window.open("https://maps.app.goo.gl/X33Ys1BG7QUhDydq8", "_blank")}
        >
          Buka Google Maps
        </Button>
      </div>
    </motion.div>
    </Section>
  );
}
