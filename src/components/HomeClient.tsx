"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero/Hero";
import { Salam } from "@/components/Salam/Salam";
import { Profile } from "@/components/Profile/Profile";
import { Events } from "@/components/Events/Events";
import { Adab } from "@/components/Adab/Adab";
import { Wishes } from "@/components/Wishes/Wishes";
import { Gift } from "@/components/Gift/Gift";
import { Rsvp } from "@/components/Rsvp/Rsvp";
import { Notice } from "@/components/Notice/Notice";
import { Footer } from "@/components/Footer/Footer";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { ImageSection } from "@/components/ImageSection/ImageSection";

interface HomeClientProps {
  guestName: string;
}

export function HomeClient({ guestName }: HomeClientProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Lock body scroll when closed
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true); // Auto-play when opened
  };

  return (
    <main className="min-h-screen relative selection:bg-gold-accent/30 selection:text-navy-primary">
      <Hero isOpened={isOpened} onOpen={handleOpen} guestName={guestName} />
      
      {/* Audio Player */}
      {isOpened && (
        <AudioPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
      )}

      {/* Main Content */}
      <div className={`relative z-0 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
          <Salam />
          
          <ImageSection 
             src="https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000&auto=format&fit=crop" 
             alt="Wedding Couple"
          />

          <Profile />

          <Events />

          <ImageSection 
             src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop" 
             alt="Wedding Detail"
             className="md:h-[400px]"
          />

          <Adab />
          <Wishes />
          <Gift />
          <Rsvp />
          <Notice />
          <Footer />
      </div>
    </main>
  );
}
