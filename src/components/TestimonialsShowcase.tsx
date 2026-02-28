import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Abebe Kebede',
    role: 'CEO, TechEthio Solutions',
    quote: 'G-Squad transformed our entire digital presence. The AI chatbot alone increased our lead conversion by 300%. Truly next-level work.',
    rating: 5,
    avatar: '🧑‍💼',
  },
  {
    name: 'Sara Tesfaye',
    role: 'Founder, Addis Interiors',
    quote: 'The 3D architectural visualizations were breathtaking. Our clients now see their dream spaces before a single brick is laid.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'Yonas Girma',
    role: 'CTO, EthioFinance',
    quote: "Their web development expertise is unmatched. The Telebirr integration was seamless and our platform handles 10K+ transactions daily.",
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: 'Meron Hailu',
    role: 'Director, Habesha Fashion',
    quote: 'The e-commerce platform they built doubled our online sales in the first month. The design is absolutely stunning.',
    rating: 5,
    avatar: '👩‍🎨',
  },
  {
    name: 'Daniel Assefa',
    role: 'Manager, Sheraton Addis',
    quote: 'The virtual hotel tour experience has been a game-changer for our bookings. Guests love exploring rooms in 3D before arriving.',
    rating: 5,
    avatar: '🏨',
  },
  {
    name: 'Hana Wolde',
    role: 'Owner, Yod Abyssinia',
    quote: 'The POS system and order management platform streamlined our entire operation. We save 4 hours daily on admin work.',
    rating: 5,
    avatar: '🍽️',
  },
];

export const TestimonialsShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 60, rotateX: 15, transformPerspective: 1000 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.8, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6">
            💬 Client Stories
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
            What Our <span className="text-gradient-cyber">Clients</span> Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real businesses we've helped grow and transform digitally.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card p-6 rounded-2xl glass border-glow group hover:scale-[1.02] transition-all duration-500">
              <Quote className="w-8 h-8 text-gold/30 mb-4" />
              <p className="text-foreground text-sm leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">{t.avatar}</div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm group-hover:text-gold transition-colors">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
