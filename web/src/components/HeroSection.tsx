import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Hls from "hls.js";

const VIDEO_SRC = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";
const POSTER =
  "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=85&w=2560";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Don't downscale quality to the element size — we want the sharpest rendition.
        capLevelToPlayerSize: false,
        startLevel: -1,
        maxBufferLength: 30,
      });
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Lock to the highest-quality rendition (levels are sorted low→high bitrate).
        if (hls.levels.length > 0) {
          const top = hls.levels.length - 1;
          hls.autoLevelCapping = top;
          hls.currentLevel = top;
        }
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    }
  }, []);

  return (
    <section id="top" className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={POSTER}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Overlay — darkens the video for contrast (no blur, keeps it crisp) */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Decorative gradients */}
      <div className="pointer-events-none absolute top-[-20%] left-[20%] h-[600px] w-[600px] bg-blue-900/20 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[20%] h-[500px] w-[500px] bg-indigo-900/20 blur-[120px] mix-blend-screen" />

      {/* Content */}
      <div className="relative z-10 mx-auto mt-20 flex max-w-5xl flex-col items-center space-y-12 px-6 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl leading-[1.1] text-white sm:text-5xl lg:text-[48px]"
        >
          Machines that keep watch.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-6xl font-semibold leading-[0.9] tracking-tighter text-transparent sm:text-8xl lg:text-[136px]"
        >
          Never off&nbsp;duty
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl text-lg leading-[1.65] text-white sm:text-[20px]"
        >
          Autonomous security robots patrol your site through the night — and prove every minute of
          their work on-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center gap-6 sm:flex-row"
        >
          {/* Primary */}
          <a
            href="#contacts"
            className="group flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <span className="text-lg font-medium text-[#0a0400]">Start a Pilot</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3054ff] transition-colors group-hover:bg-[#2040e0]">
              <ArrowRight className="h-5 w-5 text-white" />
            </span>
          </a>

          {/* Secondary */}
          <a
            href="#operations"
            className="group flex items-center gap-2 rounded-lg px-4 py-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/5 hover:text-white"
          >
            See it live
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
