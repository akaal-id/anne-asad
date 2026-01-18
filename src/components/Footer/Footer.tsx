import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.messageContainer}>
        <p className={styles.quote}>
          "Semoga Allah menghimpun yang terserak dari keduanya, memberkati mereka berdua dan kiranya Allah meningkatkan kualitas keturunan mereka, menjadikannya pembuka rahmat, sumber ilmu dan hikmah serta pemberi rasa aman bagi umat."
        </p>
        <p className={styles.closing}>وَ عَلَيْكُمُ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ</p>
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
    </footer>
  );
}
