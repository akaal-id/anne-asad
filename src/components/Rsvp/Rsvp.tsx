"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Rsvp.module.css";
import { cn, BASE_PATH } from "@/lib/utils";

export function Rsvp() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"hadir" | "tidak" | null>(null);
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !status) {
      setError("Mohon lengkapi data RSVP.");
      return;
    }
    
    try {
        const res = await fetch(`${BASE_PATH}/api/rsvp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, status, guests })
        });

        if (res.ok) {
            setSubmitted(true);
        } else {
            setError("Gagal mengirim konfirmasi. Silakan coba lagi.");
        }
    } catch (err) {
        console.error("RSVP Error", err);
        setError("Terjadi kesalahan koneksi.");
    }
  };

  if (submitted) {
    return (
      <Section className={styles.successWrapper}>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={styles.successCard}
        >
            <h2 className={styles.successTitle}>Terima Kasih</h2>
            <p className={styles.successMessage}>
            Konfirmasi kehadiran Anda telah kami terima. Kami menantikan kehadiran Anda di hari bahagia kami.
            </p>
            <Button variant="outline" className={styles.editButton} onClick={() => setSubmitted(false)}>
            Edit Kehadiran
            </Button>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Konfirmasi Kehadiran</h2>
        <div className={styles.divider}></div>
        <p className={styles.description}>
        Tanpa mengurangi rasa hormat, mohon kerelaan Bapak/Ibu/Saudara/i untuk mengonfirmasi kehadiran melalui tautan di bawah ini sebelum tanggal 1 Februari 2026.
        </p>
      </div>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Nama Tamu</label>
            <input 
              type="text" 
              className={styles.input}
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
             <label className={styles.label}>Konfirmasi</label>
             <div className={styles.confirmationGrid}>
               <button
                 type="button"
                 className={cn(
                   styles.optionButton,
                   status === 'hadir' ? styles.optionButtonActiveHadir : styles.optionButtonInactive
                 )}
                 onClick={() => setStatus('hadir')}
               >
                 <Check className="w-5 h-5" />
                 <span className={styles.optionText}>Hadir</span>
               </button>
               <button
                 type="button"
                 className={cn(
                    styles.optionButton,
                    status === 'tidak' ? styles.optionButtonActiveTidak : styles.optionButtonInactive
                  )}
                 onClick={() => setStatus('tidak')}
               >
                 <X className="w-5 h-5" />
                 <span className={styles.optionText}>Tidak Hadir</span>
               </button>
             </div>
          </div>

          {status === 'hadir' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative">
              <label className={styles.label}>Jumlah Tamu</label>
              <select 
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className={styles.input}
                style={{ cursor: 'pointer' }}
              >
                <option value={1}>1 Orang</option>
                <option value={2}>2 Orang</option>
              </select>
              <p className={styles.guestNote}>*Mohon maaf, kami membatasi jumlah tamu maksimal 2 orang per undangan demi kenyamanan bersama.</p>
            </motion.div>
          )}

          {error && <p className={styles.errorMessage}>{error}</p>}

          <Button type="submit" className={styles.submitButton}>Kirim Konfirmasi</Button>
        </form>
      </div>
    </Section>
  );
}
