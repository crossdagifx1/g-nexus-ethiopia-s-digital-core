import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton = ({
  children,
  strength = 0.3,
  className = '',
  onClick,
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !contentRef.current) return;

    const button = buttonRef.current;
    const content = contentRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(content, {
        x: x * strength * 0.5,
        y: y * strength * 0.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, content], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center will-change-transform ${className}`}
    >
      <span ref={contentRef} className="will-change-transform">
        {children}
      </span>
    </button>
  );
};

// Hover effect with glow
interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlowButton = ({
  children,
  className = '',
  onClick,
}: GlowButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !glowRef.current) return;

    const button = buttonRef.current;
    const glow = glowRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glow, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to(glow, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(glow, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        ref={glowRef}
        className="absolute w-32 h-32 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, hsla(var(--gold), 0.4) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Ripple effect on click
interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const RippleButton = ({
  children,
  className = '',
  onClick,
}: RippleButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'absolute rounded-full pointer-events-none';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.background = 'hsla(var(--gold), 0.3)';
    
    buttonRef.current.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { width: 0, height: 0, opacity: 1 },
      {
        width: 200,
        height: 200,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
        xPercent: -50,
        yPercent: -50,
      }
    );

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </button>
  );
};
