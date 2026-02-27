import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { SectionDivider } from "@/components/SectionDivider";
import { ServicesSection } from "@/components/ServicesSection";
import { TeamSection } from "@/components/TeamSection";
import { GNexusSection } from "@/components/GNexusSection";
import { ContactSection } from "@/components/ContactSection";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { FloatingLogo3D } from "@/components/3d/FloatingLogo3D";
import { WaveGrid3D } from "@/components/3d/WaveGrid3D";
import { DNA3D } from "@/components/3d/DNA3D";
import { GlobeNetwork3D } from "@/components/3d/GlobeNetwork3D";
import { NebulaVortex3D } from "@/components/3d/NebulaVortex3D";
import { ProcessSection } from "@/components/ProcessSection";
import { TestimonialsShowcase } from "@/components/TestimonialsShowcase";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <SectionDivider variant="wave" />

        {/* 3D Section 1: Innovation Hub */}
        <FloatingLogo3D />

        <SectionDivider variant="curve" flip />
        <div id="services">
          <ServicesSection />
        </div>
        <SectionDivider variant="peak" />

        {/* 3D Section 2: Digital Wave */}
        <WaveGrid3D />

        <SectionDivider variant="wave" flip />

        {/* Process Section */}
        <ProcessSection />

        <SectionDivider variant="curve" />

        {/* 3D Section 3: AI DNA */}
        <DNA3D />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <AdBanner placement="in_feed" />
        </div>

        <SectionDivider variant="peak" flip />
        <div id="team">
          <TeamSection />
        </div>
        <SectionDivider variant="wave" />

        {/* 3D Section 4: Globe Network */}
        <GlobeNetwork3D />

        <SectionDivider variant="curve" flip />
        <div id="gnexus">
          <GNexusSection />
        </div>
        <SectionDivider variant="peak" />

        {/* 3D Section 5: Nebula Vortex */}
        <NebulaVortex3D />

        <SectionDivider variant="wave" flip />

        {/* Testimonials */}
        <TestimonialsShowcase />

        <SectionDivider variant="curve" />
        <div id="contact">
          <ContactSection />
        </div>

        {/* Final CTA */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
