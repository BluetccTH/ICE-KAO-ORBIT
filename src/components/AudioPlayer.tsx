import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import showMeHowAudio from "../assets/audio/Show Me How.mp3";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
  const [audioSrc, setAudioSrc] = useState<string>(showMeHowAudio);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Attempt autoplay if user has already interacted with the document
    const handleFirstInteraction = () => {
      if (!interacted && audioRef.current) {
        setInteracted(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay prevented or failed:", err);
            // If empty or blocked, we might want to switch if it's due to invalid local file
          });
        
        // Remove listeners
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
      }
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [interacted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (volumeContainerRef.current && !volumeContainerRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // When source changes, reload and play if active
  useEffect(() => {
    if (audioRef.current && interacted) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasError(false);
            })
            .catch((err) => {
              console.error("Playback error after source change:", err);
              if (audioSrc !== fallbackUrl) {
                setAudioSrc(fallbackUrl);
                setIsUsingFallback(true);
              }
            });
        }
      }
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Failed to play local audio, switching to fallback cloud stream:", err);
          handleAudioError();
        });
    }
  };

  const handleAudioError = () => {
    console.warn("Audio source failed or is empty. Auto-switching to high-quality cloud stream...");
    setHasError(true);
    if (audioSrc !== fallbackUrl) {
      setAudioSrc(fallbackUrl);
      setIsUsingFallback(true);
    }
  };

  const toggleSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInteracted(true);
    if (isUsingFallback) {
      setAudioSrc(showMeHowAudio);
      setIsUsingFallback(false);
    } else {
      setAudioSrc(fallbackUrl);
      setIsUsingFallback(true);
    }
  };

  const handleVolumeIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showVolumeSlider) {
      setShowVolumeSlider(true);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        onError={handleAudioError}
        loop
        preload="auto"
      />

      {/* Floating capsule player */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 bg-black/70 border border-white/10 hover:border-pink-500/30 rounded-full backdrop-blur-md shadow-xl shadow-black/40 transition-all duration-300"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {/* Animated Visualizer Waves */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500/80 to-blue-500/80 hover:from-pink-500 hover:to-blue-500 text-white flex items-center justify-center shadow-md transition-all cursor-pointer relative overflow-hidden"
          title={isPlaying ? "หยุดเพลง" : "เล่นเพลงพื้นหลัง"}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Pause className="w-4 h-4 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="pl-0.5"
              >
                <Play className="w-4 h-4 text-white fill-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Music Icon & Dynamic Status */}
        <div className="flex flex-col pr-1 text-left select-none max-w-[110px] sm:max-w-[130px]">
          <span className="text-[8px] text-gray-400 font-mono tracking-wider uppercase flex items-center gap-1">
            <Music className={`w-2.5 h-2.5 text-pink-400 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            {isPlaying ? "Now Playing" : "Music Paused"}
          </span>
          <span className="text-[10px] text-white font-bold font-sans truncate tracking-tight">
            {isUsingFallback ? "Show Me How (Cloud)" : "Show Me How"}
          </span>
          {/* Source Toggle Button */}
          <button
            onClick={toggleSource}
            className="text-[8px] text-pink-300/80 hover:text-pink-300 underline text-left transition-colors cursor-pointer font-sans mt-[1px]"
            title="สลับช่องทางเพื่อรับฟังเสียงคลาวด์/เครื่อง"
          >
            {isUsingFallback ? "⚡ ใช้ไฟล์เครื่อง (เงียบ)" : "🪐 ใช้ไฟล์คลาวด์สำรอง"}
          </button>
        </div>

        {/* Dynamic Spectrum Wave when playing */}
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3 px-1.5">
            <span className="w-[2px] bg-pink-400 rounded-full animate-pulse" style={{ height: "40%", animationDuration: "0.6s" }} />
            <span className="w-[2px] bg-rose-400 rounded-full animate-pulse" style={{ height: "100%", animationDuration: "0.4s" }} />
            <span className="w-[2px] bg-indigo-400 rounded-full animate-pulse" style={{ height: "70%", animationDuration: "0.5s" }} />
            <span className="w-[2px] bg-blue-400 rounded-full animate-pulse" style={{ height: "50%", animationDuration: "0.7s" }} />
          </div>
        )}

        {/* Volume controls */}
        <div ref={volumeContainerRef} className="flex items-center gap-1.5 pl-1.5 border-l border-white/10 relative">
          <button
            onClick={handleVolumeIconClick}
            className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง / ปรับระดับ"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-pink-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            )}
          </button>

          {/* Volume Slider - expands on hover or tap */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 85, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden flex items-center pr-2"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="cosmic-slider w-20 cursor-pointer"
                  title="ระดับเสียง"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
