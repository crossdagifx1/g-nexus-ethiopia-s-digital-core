import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroPattern})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-8 opacity-0 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Habesha Futurism • Digital Excellence</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight opacity-0 animate-fade-in animation-delay-100">
          Ancient Wisdom
          <br />
          <span className="text-gradient-gold">Futuristic Technology</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in animation-delay-200">
          We are G-Squad — a premier digital agency building Ethiopia's 
          digital infrastructure through web, 3D, AI, and the G-Nexus platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-300">
          <Button variant="hero" size="xl">
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="heroOutline" size="xl">
            Explore G-Nexus
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/30 max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-400">
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-gold mb-2">50+</div>
            <div className="text-muted-foreground text-sm">Projects Delivered</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-cyan mb-2">3</div>
            <div className="text-muted-foreground text-sm">Expert Founders</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">∞</div>
            <div className="text-muted-foreground text-sm">Possibilities</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in animation-delay-500">
        <span className="text-muted-foreground text-sm">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
};
