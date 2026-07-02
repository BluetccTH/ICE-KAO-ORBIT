import React, { useState, useEffect } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function PortalLink() {
  const [url, setUrl] = useState("https://bluetccth.github.io/ICE-KAO-ORBIT/");
  const [label, setLabel] = useState("ไปยังจักรวาลถัดไป 🚀");
  const [description, setDescription] = useState("แตะเพื่อวาร์ปไปยังอีกหนึ่งดินแดนแห่งความทรงจำของเรา");

  // Load from localStorage on mount in case they set custom values previously
  useEffect(() => {
    const savedUrl = localStorage.getItem("orbit_portal_url");
    const savedLabel = localStorage.getItem("orbit_portal_label");
    const savedDesc = localStorage.getItem("orbit_portal_desc");

    if (savedUrl) {
      setUrl(savedUrl);
    }
    if (savedLabel) {
      setLabel(savedLabel);
    }
    if (savedDesc) {
      setDescription(savedDesc);
    }
  }, []);

  return (
    <div id="portal-link-container" className="w-full max-w-4xl mx-auto mt-12 bg-white/5 border border-blue-500/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Animated Cosmic Portal Icon & Title */}
        <div className="flex items-center gap-5 flex-1 w-full text-left">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            {/* Pulsing ring 1 */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-blue-400/40 rounded-full"
            />
            {/* Pulsing ring 2 */}
            <motion.div 
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-2 border border-dotted border-purple-400/50 rounded-full"
            />
            {/* Portal center glow */}
            <div className="absolute inset-4 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full blur-sm opacity-60 animate-pulse" />
            <Globe className="w-6 h-6 text-white relative z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Wormhole Portal</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1 font-sans">
              ประตูมิติเชื่อมโยงจักรวาล
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              {description}
            </p>
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-end">
          {/* Main Destination Button */}
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all border border-white/10"
          >
            <span>{label}</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>

      </div>
    </div>
  );
}
