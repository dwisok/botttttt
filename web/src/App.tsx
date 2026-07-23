import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Mission } from "@/components/sections/Mission";
import { TheUnit } from "@/components/sections/TheUnit";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Operations } from "@/components/sections/Operations";
import { Token } from "@/components/sections/Token";
import { Numbers } from "@/components/sections/Numbers";
import { Questions } from "@/components/sections/Questions";
import { GetInvolved } from "@/components/sections/GetInvolved";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function App() {
  return (
    <div className="bg-hero-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <Mission />
      <TheUnit />
      <HowItWorks />
      <Operations />
      <Token />
      <Numbers />
      <Questions />
      <GetInvolved />
      <SiteFooter />
    </div>
  );
}
