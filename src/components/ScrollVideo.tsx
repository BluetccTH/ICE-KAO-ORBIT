import React, { useEffect, useRef, useState } from "react";

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle loadedmetadata
    const handleLoadedMetadata = () => {
      setIsMetadataLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    // In case it's already loaded or cached in the browser
    if (video.readyState >= 1) {
      setIsMetadataLoaded(true);
    }

    let animationFrameId: number;
    let targetTime = 0;
    let currentTime = 0;

    function getScrollProgress() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollRange = docHeight - winHeight;
      if (scrollRange <= 0) return 0;
      return Math.max(0, Math.min(1, scrollY / scrollRange));
    }

    const updateVideoProgress = () => {
      if (video && video.duration) {
        const progress = getScrollProgress();
        // Slightly buffer the end to prevent video empty states
        targetTime = progress * (video.duration - 0.05);
        
        // Linear interpolation (lerp) for ultra-smooth gliding feel on scroll
        currentTime += (targetTime - currentTime) * 0.1;
        
        if (Math.abs(currentTime - targetTime) < 0.01) {
          currentTime = targetTime;
        }

        // Only seek if the difference is substantial, preventing unnecessary frame-decoder spam
        if (Math.abs(video.currentTime - currentTime) > 0.03) {
          video.currentTime = currentTime;
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoProgress);
    };

    animationFrameId = requestAnimationFrame(updateVideoProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <div
      id="scroll-video-container"
      className="fixed inset-0 -z-10 bg-[#0a0a16] overflow-hidden pointer-events-none"
    >
      {/* Real-time seeking video direct rendering to prevent canvas and CORS issues */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        src={VIDEO_URL}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
        style={{ opacity: isMetadataLoaded ? 0.6 : 0 }}
      />

      {/* Loading overlay for metadata */}
      {!isMetadataLoaded && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/20 text-xs font-mono text-pink-300">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>เนบิวลากำลังเตรียมพร้อม...</span>
        </div>
      )}

      {/* Deep space overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#030310]/95" />
    </div>
  );
}
