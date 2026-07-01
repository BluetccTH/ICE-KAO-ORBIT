import React, { useState, useEffect, useRef } from "react";
import { Heart, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  rotateSpeed: number;
}

function playBubbleSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Quick sweet bubble pop sound sweep: 600Hz -> 1200Hz
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (err) {
    // Ignore audio failures
  }
}

export default function AnniversaryTimer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  // We can default their relationship start date to a sweet date like October 6, 2024 (e.g. Ice's 17th birthday or similar)
  // Let the user adjust this date!
  const [startDateStr, setStartDateStr] = useState("2026-07-14");
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  // Calculate days until birthdays
  const [iceDaysLeft, setIceDaysLeft] = useState(0);
  const [kaoDaysLeft, setKaoDaysLeft] = useState(0);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if clicking elements, but not inputs
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.closest("input") || target.closest("button")) {
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    playBubbleSound();

    const heartColors = [
      "text-pink-400",
      "text-pink-500",
      "text-rose-400",
      "text-rose-500",
      "text-red-400",
      "text-red-500",
      "text-purple-400",
      "text-indigo-400",
      "text-sky-400",
      "text-cyan-400"
    ];

    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 6; i++) {
      // Upward semi-circle explosion: 200 to 340 degrees
      const angleDeg = 200 + Math.random() * 140;
      const angle = (angleDeg * Math.PI) / 180;
      const speed = Math.random() * 2 + 1.5;
      newHearts.push({
        id: Date.now() + Math.random(),
        x,
        y,
        size: Math.random() * 14 + 12, // 12px to 26px
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        angle,
        speed,
        rotateSpeed: (Math.random() - 0.5) * 8,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
  };

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr);
      const now = new Date();
      let diffMs = now.getTime() - start.getTime();

      if (diffMs < 0) {
        setTimePassed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
        return;
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Calculate broken down years, months, days
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTimePassed({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
      });

      // Calculate birthday days left
      const calcDaysUntilBday = (month: number, date: number) => {
        const bdayThisYear = new Date(now.getFullYear(), month - 1, date);
        if (bdayThisYear.getTime() < now.getTime()) {
          bdayThisYear.setFullYear(now.getFullYear() + 1);
        }
        const diff = bdayThisYear.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      };

      setIceDaysLeft(calcDaysUntilBday(10, 6)); // Ice: 6 Oct
      setKaoDaysLeft(calcDaysUntilBday(4, 3));  // Kao: 3 Apr
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className="w-full max-w-4xl mx-auto bg-white/5 border border-pink-500/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl relative overflow-hidden cursor-pointer select-none"
    >
      {/* Floating hearts container */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 1,
                scale: 0.6,
                x: heart.x - heart.size / 2,
                y: heart.y - heart.size / 2,
                rotate: 0,
              }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0.6, 1.2, 0.8],
                x: heart.x - heart.size / 2 + Math.cos(heart.angle) * 110,
                y: heart.y - heart.size / 2 + Math.sin(heart.angle) * 110 - 40,
                rotate: heart.rotateSpeed * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                setHearts((prev) => prev.filter((h) => h.id !== heart.id));
              }}
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
              }}
            >
              <Heart
                className={`${heart.color} fill-current`}
                style={{ width: heart.size, height: heart.size }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 text-pink-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-pink-500/20 mb-3">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          เวลาเดินทางแห่งความรัก
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          เราโคจรเคียงข้างกันมาแล้ว...
        </h2>
        <p className="text-pink-300/60 text-xs mt-1.5 flex items-center justify-center gap-1 animate-pulse">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>จิ้มบนการ์ดตรงไหนก็ได้เพื่อส่งสายฝนหัวใจให้คนสำคัญนะจ๊ะ 💖</span>
        </p>
      </div>

      {/* Date Picker Input */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <label className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-pink-400" />
          ตั้งค่าวันครบรอบ:
        </label>
        <input
          type="date"
          value={startDateStr}
          onChange={(e) => setStartDateStr(e.target.value)}
          className="bg-black/50 border border-pink-500/30 text-pink-200 rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Big Counter Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "ปี (Years)", value: timePassed.years, color: "from-pink-500 to-rose-500" },
          { label: "เดือน (Months)", value: timePassed.months, color: "from-purple-500 to-indigo-500" },
          { label: "วัน (Days)", value: timePassed.days, color: "from-indigo-500 to-blue-500" },
          { label: "วินาที (Seconds)", value: timePassed.seconds, color: "from-teal-500 to-emerald-500" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/40 border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />
            <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
              {item.value}
            </div>
            <div className="text-[11px] text-gray-400 mt-2 font-sans tracking-wide">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Days & Cute message */}
      <div className="bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/15 rounded-2xl p-5 text-center mb-8">
        <p className="text-sm md:text-base text-pink-200 font-sans">
          คิดเป็นทั้งหมด <strong className="text-xl font-bold font-mono text-white mx-1.5">{timePassed.totalDays}</strong> วันที่มีเธอเข้ามาแต่งแต้มโลกใบนี้ให้สดใส 💖
        </p>
      </div>

      {/* Birthdays Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ice Birthday */}
        <div className="bg-pink-500/5 border border-pink-500/10 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-lg">
              🧊
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">วันเกิดพี่ไอซ์ 💗</h3>
              <p className="text-xs text-gray-400 mt-0.5">วันเสาร์ที่ 6 ตุลาคม (อายุ 18)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-lg font-bold text-pink-300 font-mono">
              {iceDaysLeft}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-mono">
              วันเหลือกาล
            </span>
          </div>
        </div>

        {/* Kao Birthday */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">
              🔭
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">วันเกิดก้าว 🔭</h3>
              <p className="text-xs text-gray-400 mt-0.5">วันศุกร์ที่ 3 เมษายน (อายุ 17)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-lg font-bold text-blue-300 font-mono">
              {kaoDaysLeft}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-mono">
              วันเหลือกาล
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
