import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  children?: ReactNode;
}

export const PageHero = ({ title, subtitle, badge, children }: PageHeroProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Master timeline
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Badge animation
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          0.2
        );
      }

      // Title word-by-word reveal
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 60, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
          0.4
        );
      }

      // Subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.6
        );
      }

      // Children (buttons etc)
      if (childrenRef.current) {
        tl.fromTo(
          childrenRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.8
        );
      }

      // Parallax orbs
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          yPercent: 50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          yPercent: -30,
          xPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tibeb-pattern opacity-30" />
      <div 
        ref={orb1Ref}
        className="absolute top-20 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl will-change-transform" 
      />
      <div 
        ref={orb2Ref}
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl will-change-transform" 
      />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {badge && (
          <span 
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-6 opacity-0"
          >
            {badge}
          </span>
        )}
        
        <h1 
          ref={titleRef}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight opacity-0"
        >
          <span className="text-gradient-gold">{title}</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed opacity-0"
        >
          {subtitle}
        </p>
        
        {children && (
          <div ref={childrenRef} className="mt-8 opacity-0">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};
