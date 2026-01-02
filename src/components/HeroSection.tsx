import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";

const floatingFeatures = [
  { icon: <Zap className="w-5 h-5" />, label: "Lightning Fast", delay: "0ms" },
  { icon: <Shield className="w-5 h-5" />, label: "Secure", delay: "200ms" },
  { icon: <Globe className="w-5 h-5" />, label: "Global Ready", delay: "400ms" },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-scale-in"
        style={{ backgroundImage: `url(${heroPattern})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-8 opacity-0 animate-fade-in hover:bg-gold/20 hover:scale-105 transition-all duration-300 cursor-default">
          <Sparkles className="w-4 h-4 animate-pulse-glow" />
          <span>Habesha Futurism • Digital Excellence</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-tight opacity-0 animate-fade-in animation-delay-100">
          <span className="inline-block hover:scale-105 transition-transform duration-300">Ancient</span>{" "}
          <span className="inline-block hover:scale-105 transition-transform duration-300">Wisdom</span>
          <br />
          <span className="text-gradient-gold text-glow-gold inline-block hover:scale-105 transition-transform duration-300">Futuristic Technology</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 opacity-0 animate-fade-in animation-delay-200 leading-relaxed">
          We are <span className="text-gold font-semibold">G-Nexus</span> — Ethiopia's premier digital platform 
          building the future through web, 3D, and AI innovation.
        </p>

        {/* Floating Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 opacity-0 animate-fade-in animation-delay-300">
          {floatingFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-foreground text-sm hover:scale-110 hover:bg-gold/10 transition-all duration-300 cursor-default"
              style={{ animationDelay: feature.delay }}
            >
              <span className="text-cyan">{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-400">
          <Button variant="hero" size="xl" className="group">
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button variant="heroOutline" size="xl" className="group">
            <span className="group-hover:text-gold transition-colors duration-300">Explore Platform</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-24 pt-10 border-t border-border/30 max-w-3xl mx-auto opacity-0 animate-fade-in animation-delay-500">
          {[
            { value: "50+", label: "Projects Delivered", color: "text-gold" },
            { value: "2", label: "Expert Founders", color: "text-cyan" },
            { value: "∞", label: "Possibilities", color: "text-foreground" },
          ].map((stat, index) => (
            <div key={stat.label} className="group cursor-default">
              <div className={`text-4xl md:text-5xl font-display font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
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
