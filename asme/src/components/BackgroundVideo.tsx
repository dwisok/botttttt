import { useEffect, useRef } from "react";
import Hls from "hls.js";

// HLS stream hosted on Mux (.m3u8 needs hls.js on non-Safari browsers).
const VIDEO_SRC = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Native HLS (Safari / iOS) — set the source directly.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
      return;
    }

    // Everyone else — use hls.js.
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}
