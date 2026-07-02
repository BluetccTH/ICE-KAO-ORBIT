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
  const [showVolumeSlider, setShowVolumeSlider] = useState(true);
  const [interacted, setInteracted] = useState(false);

  const fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
  const [audioSrc, setAudioSrc] = useState<string>(showMeHowAudio);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Autoplay removed. User must click the play button themselves.

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Keep volume slider permanently open
  useEffect(() => {
    // Left empty since slider is always visible
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
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="relative flex items-center gap-3 z-50">
      <audio
        ref={audioRef}
        src={audioSrc}
        onError={handleAudioError}
        loop
        preload="auto"
      />

      {/* Floating capsule player */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex items-center gap-3 px-4 py-2 bg-[#090d16]/85 border border-sky-500/30 rounded-2xl backdrop-blur-md shadow-lg shadow-black/40 transition-all duration-300 min-w-[280px]"
      >
        {/* Play Button Wrapper with Tooltip */}
        <div className="relative">
          {/* Tooltip speech bubble (below the button) */}
          <AnimatePresence>
            {!isPlaying && !interacted && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-sky-500 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-sky-400/30 whitespace-nowrap flex items-center gap-1 animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                <span>✨ แตะปุ่มนี้เพื่อเปิดเพลงนะคะ! 🎵</span>
                {/* Little triangle arrow pointing up */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-[1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-sky-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Styled play button matching the mockup */}
          <button
            onClick={togglePlay}
            className={`w-10 h-10 rounded-xl border ${
              isPlaying
                ? "border-pink-500/50 bg-pink-950/20 text-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.3)] animate-pulse"
                : "border-sky-500/30 bg-sky-950/20 text-sky-400"
            } hover:border-sky-400 hover:text-sky-300 flex items-center justify-center transition-all cursor-pointer`}
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
                >
                  <Music className="w-5 h-5 text-sky-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Content Column (Title + Volume Slider) */}
        <div className="flex flex-col gap-1 flex-1 select-none text-left min-w-0">
          {/* Volume Icon + Song Title Row */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={handleVolumeIconClick}
              className="text-sky-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-pink-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              )}
            </button>
            <span className="text-[11px] text-sky-300 font-bold truncate tracking-wide font-sans shrink-0">
              {isUsingFallback ? "Show Me How (Cloud)" : "Show Me How"}
            </span>
          </div>

          {/* Volume Slider Row with Custom CSS Slider */}
          <div className="flex items-center w-full pr-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="cosmic-slider w-full cursor-pointer h-1.5"
              title="ระดับเสียง"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
