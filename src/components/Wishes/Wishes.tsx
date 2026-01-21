"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_PATH } from "@/lib/utils";
import styles from "./Wishes.module.css";

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

const INITIAL_WISHES: Wish[] = [
  { id: 1, name: "Keluarga Besar", message: "Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fii khair. Selamat menempuh hidup baru!", date: "Baru saja" },
  { id: 2, name: "Sahabat", message: "Semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin.", date: "5 Menit yang lalu" },
];

export function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Initial fetch
  useEffect(() => {
    const fetchWishes = async () => {
        try {
            const res = await fetch(`${BASE_PATH}/api/wishes`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            
            if (Array.isArray(data) && data.length > 0) {
                setWishes(data);
            }
        } catch (err) {
            console.error("Failed to fetch wishes", err);
        }
    };
    
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Mohon isi nama dan ucapan.");
      return;
    }
    
    // Optimistic update
    const tempId = Date.now();
    const newWishOptimistic: Wish = {
        id: tempId,
      name,
      message,
        date: "Baru saja" // API usually sets date, but we mock it here
    };
    
    setWishes([newWishOptimistic, ...wishes]);
    setName("");
    setMessage("");
    setError("");

    try {
        const res = await fetch(`${BASE_PATH}/api/wishes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
        });
        
        if (res.ok) {
            const savedWish = await res.json();
            // Replace optimistic with real
            setWishes(prev => [savedWish, ...prev.filter(w => w.id !== tempId)]);
        }
    } catch (err) {
        console.error("Failed to save wish", err);
        // Rollback if needed
    }
  };

  return (
    <Section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Ucapan & Doa</h2>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.grid}>
        {/* Form */}
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={styles.label}>Nama</label>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className={styles.label}>Ucapan & Doa</label>
              <textarea 
                rows={4}
                className={styles.textarea}
                placeholder="Tuliskan ucapan dan doa... (Maksimal 300 karakter)"
                value={message}
                maxLength={300}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {message.length}/300
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Button type="submit" className="w-full mt-2">Kirim Ucapan</Button>
          </form>
        </div>

        {/* List */}
        <div className={styles.listWrapper}>
          <h3 className={styles.listTitle}>{wishes.length} Ucapan</h3>
          <div className={styles.listContainer}>
          <AnimatePresence mode="popLayout">
            {wishes.map((wish) => (
              <motion.div 
                key={wish.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className={styles.wishCard}
              >
                <div className={styles.wishHeader}>
                  <h4 className={styles.wishName}>{wish.name}</h4>
                  <span className={styles.wishDate}>{wish.date}</span>
                </div>
                  <p className={styles.wishMessage}>{wish.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
