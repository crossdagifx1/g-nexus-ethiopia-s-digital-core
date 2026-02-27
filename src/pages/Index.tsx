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

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <SectionDivider variant="wave" />
        <div id="services">
          <ServicesSection />
        </div>
        <SectionDivider variant="curve" flip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AdBanner placement="in_feed" />
        </div>
        <SectionDivider variant="peak" />
        <div id="team">
          <TeamSection />
        </div>
        <SectionDivider variant="wave" flip />
        <div id="gnexus">
          <GNexusSection />
        </div>
        <SectionDivider variant="curve" />
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
