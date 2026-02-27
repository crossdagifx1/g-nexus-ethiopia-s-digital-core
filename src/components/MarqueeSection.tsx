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

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  return (
    <section className="relative py-12 overflow-hidden border-y border-border/30">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <div ref={trackRef} className="flex gap-8 whitespace-nowrap will-change-transform">
        {[...techStack, ...techStack].map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="flex items-center gap-3 px-6 py-3 rounded-full glass text-foreground text-sm font-medium hover:bg-gold/10 hover:text-gold transition-colors duration-300 cursor-default flex-shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-gold" />
            {tech}
          </div>
        ))}
      </div>
    </section>
  );
};
