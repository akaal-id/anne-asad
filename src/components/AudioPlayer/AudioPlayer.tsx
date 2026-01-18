"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./AudioPlayer.module.css";
import { cn, BASE_PATH } from "@/lib/utils";

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function AudioPlayer({ isPlaying, onToggle }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    // Added timestamp to prevent caching issues when file is updated
    audioRef.current = new Audio(`${BASE_PATH}/audio/background-music.mp3?v=` + new Date().getTime()); 
    audioRef.current.loop = true;
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Attempt to play
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play failed (browser policy?):", error);
            // If autoplay fails, we might want to update state, but usually we just let the user toggle it manually later.
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={styles.container}>
      <button 
        onClick={onToggle} 
        className={cn(styles.button, isPlaying && styles.playing)}
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 className={styles.icon} />
        ) : (
          <VolumeX className={styles.icon} />
        )}
      </button>
    </div>
  );
}
