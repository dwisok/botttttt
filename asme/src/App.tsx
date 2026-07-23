import { MotionConfig } from "motion/react";
import { BackgroundVideo } from "./components/BackgroundVideo";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative bg-black h-screen w-screen flex flex-col overflow-hidden selection:bg-white selection:text-black shrink-0">
        <BackgroundVideo />
        <Navbar />
        <Hero />
      </main>
    </MotionConfig>
  );
}
