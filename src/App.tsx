import React, { useState, useEffect } from "react";
import { Heart, Stars, ArrowDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

// Components
import ScrollVideo from "./components/ScrollVideo";
import CelestialParticles from "./components/CelestialParticles";
import AnniversaryTimer from "./components/AnniversaryTimer";
import PasscodeGate from "./components/PasscodeGate";
import AudioPlayer from "./components/AudioPlayer";

export default function App() {
  // =========================
  // Authentication
  // =========================
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved =
      sessionStorage.getItem("is_ice_authenticated") === "true";

    setIsAuthenticated(saved);
  }, []);

  const handleScrollToContent = () => {
    const contentSec = document.getElementById("anniversary-section");

    if (contentSec) {
      contentSec.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // =========================
  // Passcode Screen
  // =========================
  if (!isAuthenticated) {
    return (
      <PasscodeGate
        onSuccess={() => {
          setIsAuthenticated(true);

          sessionStorage.setItem(
            "is_ice_authenticated",
            "true"
          );
        }}
      />
    );
  }

  // =========================
  // Main Website
  // =========================
  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden">

      {/* Background */}
      <ScrollVideo />
      <CelestialParticles />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center">

          <div className="flex items-center gap-2">

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear",
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 p-0.5 overflow-hidden"
            >
              <img
                src="/favicon.png"
                alt="Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>

            <span className="font-bold bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent tracking-wider">
              ICE & KAO ORBIT
            </span>

          </div>

        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030310] pointer-events-none" />

        <div className="relative z-10 max-w-4xl">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2 text-pink-300 text-xs mb-6"
          >
            <Stars className="w-4 h-4" />
            โชคชะตาเขียนเส้นทางของพวกเราไว้แล้ว
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
            className="text-4xl md:text-6xl font-extrabold"
          >
            โคจรมาพบกันใน
            <br />

            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-blue-400 bg-clip-text text-transparent">
              จักรวาลอ้อมกอดอุ่น
            </span>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .2 }}
            className="mt-8 text-gray-300 leading-8 max-w-2xl mx-auto"
          >
            ยินดีต้อนรับสู่วงโคจรรักของ

            <br />

            <span className="text-pink-300">
              พี่ไอซ์ (อาริตา ราชนาวี)
            </span>

            {" "}💗{" "}

            <span className="text-blue-300">
              ก้าว (ชิษณุพงศ์ เรณูหอม)
            </span>

            <br />

            ดวงดาวทุกดวงบนท้องฟ้ากำลังบันทึกเรื่องราวของเรา
            เพื่อให้มันคงอยู่ตลอดไป
          </motion.p>

          <div className="mt-10">

            <button
              onClick={handleScrollToContent}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:scale-105 transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2 mx-auto"
            >
              สำรวจวงโคจรของเรา

              <ArrowDown className="animate-bounce w-5 h-5" />

            </button>

          </div>

        </div>

      </header>

      {/* Anniversary */}
      <section
        id="anniversary-section"
        className="relative z-20 bg-[#030310] py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <AnniversaryTimer />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-[#02020a] border-t border-white/10 py-14 text-center">

        <div className="flex justify-center gap-2 mb-5">

          <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />

          <Stars
            className="w-5 h-5 text-purple-400 animate-spin"
            style={{ animationDuration: "12s" }}
          />

          <Heart className="w-5 h-5 fill-blue-500 text-blue-500 animate-pulse" />

        </div>

        <h3 className="font-bold tracking-widest">
          ICE 🧊 KAO
        </h3>

        <p className="text-xs text-gray-500 mt-2">
          ORBITING SINCE DAY ONE
        </p>

        <p className="max-w-xl mx-auto mt-8 text-gray-400 leading-7 text-sm">
          "星々にはハートがあるから、互いに接近して公転する。
だから、クリスタルウォーターはシンハーウォーターよりも価値がある。
そして、麻辣チーズ豆腐炒めは、カレーライスに欠かせない定番料理であり続けるだろう。"
        </p>

        <p className="text-gray-600 text-xs mt-8">
          © 2026 Kao 🔭 ❤️ Ice 🧊. พัฒนาด้วยความตั้งใจเพื่อความสุขของเธอในทุกพายุฝน
เคียงข้างดูแลกันตลอดไป 🌧️✨
        </p>

      </footer>

      {/* Scroll To Top */}
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-pink-500 transition"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Music */}
      <AudioPlayer />

    </div>
  );
}