import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
  variant?: 'wave' | 'peak' | 'curve';
  flip?: boolean;
  className?: string;
}

export const SectionDivider = ({ variant = 'wave', flip = false, className = '' }: SectionDividerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('path');
    
    const ctx = gsap.context(() => {
      paths.forEach((path, i) => {
        gsap.fromTo(path,
          { attr: { d: getStartPath(variant) }, opacity: 0.3 },
          {
            attr: { d: getEndPath(variant, i) },
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: svgRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [variant]);

  return (
    <div className={`relative w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`} style={{ height: '80px', marginTop: '-1px', marginBottom: '-1px' }}>
      <svg ref={svgRef} viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
        <path d={getEndPath(variant, 0)} fill="hsl(var(--muted))" fillOpacity="0.3" />
        <path d={getEndPath(variant, 1)} fill="hsl(var(--muted))" fillOpacity="0.15" />
      </svg>
    </div>
  );
};

function getStartPath(variant: string) {
  return 'M0,80 L1440,80 L1440,80 L0,80 Z';
}

function getEndPath(variant: string, index: number) {
  const offset = index * 10;
  switch (variant) {
    case 'wave':
      return `M0,${60 - offset} C360,${20 - offset} 720,${80 - offset} 1080,${30 - offset} C1260,${10 - offset} 1440,${50 - offset} 1440,${50 - offset} L1440,80 L0,80 Z`;
    case 'peak':
      return `M0,80 L480,${20 - offset} L720,${60 - offset} L960,${10 - offset} L1440,80 Z`;
    case 'curve':
      return `M0,${70 - offset} Q720,${-20 - offset} 1440,${70 - offset} L1440,80 L0,80 Z`;
    default:
      return getEndPath('wave', index);
  }
}
