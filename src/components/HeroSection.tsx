import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroPattern from "@/assets/hero-pattern.jpg";
import { ParallaxLayer } from "./animations/ParallaxContainer";

gsap.registerPlugin(ScrollTrigger);

const floatingFeatures = [
  { icon: <Zap className="w-5 h-5" />, label: "Lightning Fast", delay: "0ms" },
  { icon: <Shield className="w-5 h-5" />, label: "Secure", delay: "200ms" },
  { icon: <Globe className="w-5 h-5" />, label: "Global Ready", delay: "400ms" },
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Create master timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      );

      // Headline split animation
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word");
        tl.fromTo(
          words,
          { opacity: 0, y: 80, rotateX: 45 },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            duration: 1, 
            stagger: 0.1,
            ease: "expo.out" 
          },
          "-=0.4"
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
        "-=0.6"
      );

      // Features
      if (featuresRef.current) {
        const pills = featuresRef.current.querySelectorAll(".feature-pill");
        tl.fromTo(
          pills,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        );
      }

      // CTAs
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      // Stats with counting animation
      if (statsRef.current) {
        const statValues = statsRef.current.querySelectorAll(".stat-value");
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.2"
        );
      }

      // Floating particles parallax
      gsap.to(".floating-particle", {
        y: "-=100",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Background parallax
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Glow orbs parallax
      gsap.to(".glow-orb-1", {
        yPercent: 50,
        xPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(".glow-orb-2", {
        yPercent: 30,
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="hero-bg absolute inset-0 bg-cover bg-center opacity-40 will-change-transform"
        style={{ backgroundImage: `url(${heroPattern})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated Background Elements with Parallax */}
      <div className="glow-orb-1 absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl will-change-transform" />
      <div className="glow-orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-3xl will-change-transform" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-1 h-1 bg-gold/30 rounded-full will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <div 
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-8 opacity-0 hover:bg-gold/20 hover:scale-105 transition-all duration-300 cursor-default"
        >
          <Sparkles className="w-4 h-4" />
          <span>Habesha Futurism • Digital Excellence</span>
        </div>

        {/* Headline with word wrapping for animation */}
        <h1 
          ref={headlineRef}
          className="text-5xl md:text-6xl lg:text-8xl font-display font-bold text-foreground mb-6 leading-tight"
          style={{ perspective: "1000px" }}
        >
          <span className="word inline-block hover:scale-105 transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>Ancient</span>{" "}
          <span className="word inline-block hover:scale-105 transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>Wisdom</span>
          <br />
          <span className="word text-gradient-gold text-glow-gold inline-block hover:scale-105 transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>Futuristic</span>{" "}
          <span className="word text-gradient-gold text-glow-gold inline-block hover:scale-105 transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>Technology</span>
        </h1>

        {/* Subheadline */}
        <p 
          ref={subheadlineRef}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 opacity-0 leading-relaxed"
        >
          We are <span className="text-gold font-semibold">G-Nexus</span> — Ethiopia's premier digital platform 
          building the future through web, 3D, and AI innovation.
        </p>

        {/* Floating Feature Pills */}
        <div ref={featuresRef} className="flex flex-wrap justify-center gap-4 mb-12">
          {floatingFeatures.map((feature) => (
            <div
              key={feature.label}
              className="feature-pill flex items-center gap-2 px-4 py-2 rounded-full glass text-foreground text-sm hover:scale-110 hover:bg-gold/10 transition-all duration-300 cursor-default opacity-0"
            >
              <span className="text-cyan">{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center opacity-0">
          <Button variant="hero" size="xl" className="group">
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button variant="heroOutline" size="xl" className="group">
            <span className="group-hover:text-gold transition-colors duration-300">Explore Platform</span>
          </Button>
        </div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="grid grid-cols-3 gap-8 mt-24 pt-10 border-t border-border/30 max-w-3xl mx-auto opacity-0"
        >
          {[
            { value: "50+", label: "Projects Delivered", color: "text-gold" },
            { value: "2", label: "Expert Founders", color: "text-cyan" },
            { value: "∞", label: "Possibilities", color: "text-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <div className={`stat-value text-4xl md:text-5xl font-display font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
};
