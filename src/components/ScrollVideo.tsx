import React, { useEffect, useRef, useState } from "react";

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [frames, setFrames] = useState<ImageBitmap[]>([]);
  const [framesReady, setFramesReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isError, setIsError] = useState(false);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4";

  useEffect(() => {
    let active = true;

    async function extractFrames() {
      try {
        const response = await fetch(VIDEO_URL, { mode: "cors" });
        if (!response.ok) throw new Error("Video download failed");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const video = document.createElement("video");
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = "anonymous";
        video.preload = "auto";
        video.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject();
          setTimeout(() => reject(new Error("Timeout loading video metadata")), 10000);
        });

        const scale = Math.min(1, 1024 / video.videoWidth);
        const scaledWidth = Math.round(video.videoWidth * scale);
        const scaledHeight = Math.round(video.videoHeight * scale);
        const frameCount = 60; // Smooth 60 frames for scrolling

        const loadedFrames: ImageBitmap[] = [];

        for (let i = 0; i < frameCount; i++) {
          if (!active) break;
          const time = (i / (frameCount - 1)) * (video.duration - 0.05);
          video.currentTime = time;

          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              video.removeEventListener("seeked", onSeeked);
              resolve();
            };
            video.addEventListener("seeked", onSeeked);
            setTimeout(resolve, 1000); // safety timeout
          });

          try {
            const bitmap = await createImageBitmap(video, {
              resizeWidth: scaledWidth,
              resizeHeight: scaledHeight,
            });
            loadedFrames.push(bitmap);
            setLoadingProgress(Math.round(((i + 1) / frameCount) * 100));
          } catch (e) {
            console.warn("Frame extraction error", e);
          }
        }

        if (loadedFrames.length > 0 && active) {
          setFrames(loadedFrames);
          setFramesReady(true);
        }
        URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.error("Failed to pre-extract frames, falling back to real-time seek", e);
        if (active) {
          setIsError(true);
        }
      }
    }

    extractFrames();

    return () => {
      active = false;
    };
  }, []);

  // Frame drawing and scrolling logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastFrameIndex = -1;

    function handleResize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      lastFrameIndex = -1; // Force redraw
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    function getProgress() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollRange = docHeight - winHeight;
      if (scrollRange <= 0) return 0;
      return Math.max(0, Math.min(1, scrollY / scrollRange));
    }

    function drawFrame(frame: ImageBitmap) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / frame.width, ch / frame.height);
      const dw = frame.width * s;
      const dh = frame.height * s;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    let videoSeeking = false;
    const fallbackVideo = videoRef.current;

    function tick() {
      const progress = getProgress();

      if (framesReady && frames.length > 0) {
        const idx = Math.round(progress * (frames.length - 1));
        if (idx !== lastFrameIndex) {
          lastFrameIndex = idx;
          const currentFrame = frames[idx];
          if (currentFrame) {
            drawFrame(currentFrame);
          }
        }
      } else if (fallbackVideo && fallbackVideo.duration && !videoSeeking) {
        const targetTime = progress * fallbackVideo.duration;
        if (Math.abs(fallbackVideo.currentTime - targetTime) > 0.05) {
          videoSeeking = true;
          fallbackVideo.currentTime = targetTime;
        }
      }

      animationId = requestAnimationFrame(tick);
    }

    const seekedHandler = () => {
      videoSeeking = false;
      // Draw fallback video frame onto canvas if ready
      if (fallbackVideo && canvas && ctx && !framesReady) {
        const cw = canvas.width;
        const ch = canvas.height;
        const s = Math.max(cw / fallbackVideo.videoWidth, ch / fallbackVideo.videoHeight);
        const dw = fallbackVideo.videoWidth * s;
        const dh = fallbackVideo.videoHeight * s;
        ctx.drawImage(fallbackVideo, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      }
    };

    if (fallbackVideo) {
      fallbackVideo.addEventListener("seeked", seekedHandler);
    }

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (fallbackVideo) {
        fallbackVideo.removeEventListener("seeked", seekedHandler);
      }
    };
  }, [frames, framesReady]);

  return (
    <div
      ref={containerRef}
      id="scroll-video-container"
      className="fixed inset-0 -z-10 bg-[#0a0a16] overflow-hidden pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-60" />

      {/* Fallback real-time seeking video if pre-extraction fails or in progress */}
      {!framesReady && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover opacity-40 hidden"
        />
      )}

      {/* Loading Overlay for the Frames (Only show if loading, but keep it transparent or highly ambient) */}
      {!framesReady && !isError && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/20 text-xs font-mono text-pink-300">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>เนบิวลากำลังก่อตัว {loadingProgress}%</span>
        </div>
      )}

      {/* Deep space overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#030310]/95" />
    </div>
  );
}
