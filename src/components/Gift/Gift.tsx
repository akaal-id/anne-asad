"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import styles from "./Gift.module.css";

export function Gift() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleDownloadQR = () => {
    // Logic to download image
    const link = document.createElement("a");
    link.href = "/images/qris.png"; // Replace with actual path
    link.download = "QRIS-Wedding.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Wedding Gift</h2>
        <div className={styles.divider}></div>
        <p className={styles.description}>
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
          Namun jika memberi adalah ungkapan tanda kasih Anda, kami menerima kado pernikahan secara cashless.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Bank Account 1 */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Bank Transfer</p>
          <div className={styles.cardContent}>
             <h3 className={styles.bankName}>MANDIRI</h3>
             <p className={styles.accountNumber}>1560015417308</p>
             <p className={styles.accountName}>a.n. Aulianne Farah Aniss</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={styles.copyButton}
            onClick={() => copyToClipboard("1560015417308", "Mandiri")}
          >
            <Copy className={styles.icon} />
            {copied === "Mandiri" ? "Berhasil Disalin" : "Salin No. Rekening"}
          </Button>
        </div>

        {/* Bank Account 2 */}
        <div className={styles.card}>
           <p className={styles.cardLabel}>Bank Transfer</p>
           <div className={styles.cardContent}>
             <h3 className={styles.bankName}>BANK SYARIAH INDONESIA</h3>
             <p className={styles.accountNumber}>6706533650</p>
             <p className={styles.accountName}>a.n. Asad Muhammad</p>
           </div>
           <Button 
            variant="outline" 
            size="sm" 
            className={styles.copyButton}
            onClick={() => copyToClipboard("6706533650", "BANK SYARIAH INDONESIA")}
          >
            <Copy className={styles.icon} />
            {copied === "BANK SYARIAH INDONESIA" ? "Berhasil Disalin" : "Salin No. Rekening"}
          </Button>
        </div>
      </div>
    </Section>
  );
}
