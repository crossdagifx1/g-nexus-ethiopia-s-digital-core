import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-cyan/5" />
      <div className="absolute top-1/4 left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-gold/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-cyan/10 rounded-full blur-[100px]" />
      
      <div className="cta-content relative z-10 max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-12 lg:p-20 rounded-3xl glass border-glow">
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
            Ready to Build the <span className="text-gradient-gold text-glow-gold">Future</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Let's turn your vision into a digital masterpiece. Whether it's a website, 
            3D experience, or AI automation — the next big thing starts with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group">
              <Phone className="w-5 h-5 mr-2" />
              Book a Call
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              <span>hello@G-Nexus.dev</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan" />
              <span>+251 91 234 5678</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
