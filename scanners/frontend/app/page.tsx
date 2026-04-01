import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { Footer } from "@/components/footer";
import { AnimatedGrid } from "@/components/animated-grid";

export default function Home() {
  return (
    <main className="relative bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <AnimatedGrid />

      {/* Content */}
      <div className="relative z-20">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <Footer />
      </div>
    </main>
  );
}
