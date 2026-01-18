import styles from "./Footer.module.css";
import Image from "next/image";
import logoWhite from "../../../public/icon/logo-white-rgb.png";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.messageContainer}>
        <p className={styles.quote}>
          "Semoga Allah menghimpun yang terserak dari keduanya, memberkati mereka berdua dan kiranya Allah meningkatkan kualitas keturunan mereka, menjadikannya pembuka rahmat, sumber ilmu dan hikmah serta pemberi rasa aman bagi umat."
        </p>
        <p className={styles.closing}>{`وَالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ`}</p>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.coupleContainer}>
        <p className={styles.label}>Kami yang berbahagia</p>
        <h2 className={styles.names}>Aulianne & Asad</h2>
        <div className={styles.familyContainer}>
            <p>Keluarga Besar<br />Alm. Galuh Septono Wahyudi, S. Sos & Arifa Kurniasari</p>
            <p>Keluarga Besar<br /> Alm. Ir. Adrian & Sulistyowati, SS</p>
        </div>
      </div>

      <div className={styles.poweredContainer}>
        <div className={styles.dividerSmall}></div>
        <p className={styles.poweredText}>Powered by</p>
        <Image 
          src={logoWhite}
          alt="Logo" 
          width={80} 
          height={30}
          className={styles.logo}
        />
      </div>
    </footer>
  );
}
