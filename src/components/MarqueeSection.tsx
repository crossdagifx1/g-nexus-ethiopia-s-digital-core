import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const techStack = [
  'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Three.js', 'GSAP',
  'Blender', 'Figma', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker',
  'AWS', 'Vercel', 'Framer Motion', 'Next.js',
];

export const MarqueeSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    const isMobile = window.innerWidth < 768;
    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: isMobile ? 45 : 30,
      ease: 'none',
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  return (
    <section className="relative py-8 md:py-12 overflow-hidden border-y border-border/30">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <div ref={trackRef} className="flex gap-4 md:gap-8 whitespace-nowrap will-change-transform">
        {[...techStack, ...techStack].map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full glass text-foreground text-xs md:text-sm font-medium hover:bg-gold/10 hover:text-gold transition-colors duration-300 cursor-default flex-shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-gold" />
            {tech}
          </div>
        ))}
      </div>
    </section>
  );
};
