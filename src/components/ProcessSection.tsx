import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Lightbulb, Code2, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Discovery',
    description: 'We listen deeply to understand your vision, challenges, and goals. Every great project starts with the right questions.',
    color: 'gold',
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Strategy & Design',
    description: 'We craft a tailored blueprint — wireframes, prototypes, and a roadmap that turns your vision into a clear plan of action.',
    color: 'cyan',
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: 'Development',
    description: 'Our engineers build with precision using modern tech stacks. Clean code, tested thoroughly, optimized for performance.',
    color: 'gold',
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: 'Launch & Growth',
    description: 'We deploy, monitor, and continuously improve. Your success is our success — we grow together beyond launch day.',
    color: 'cyan',
  },
];

export const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process-card',
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, stagger: 0.2,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 tibeb-pattern" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
            ⚙️ How We Work
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
            Our <span className="text-gradient-gold">Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology refined through 50+ successful projects — transparent, agile, and results-driven.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="process-card relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-gold/30 to-transparent z-0" />
              )}
              <div className="relative p-8 rounded-2xl glass border-glow text-center group hover:scale-105 transition-all duration-500">
                <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  {i + 1}
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-${step.color}/10 flex items-center justify-center mx-auto mb-6 text-${step.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-gold transition-colors">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
