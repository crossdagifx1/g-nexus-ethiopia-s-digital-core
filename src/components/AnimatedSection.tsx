import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleUp" | "blurIn" | "rotateIn";
  delay?: number;
  duration?: number;
  stagger?: boolean;
}

const animationConfigs = {
  fadeUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
  fadeDown: { from: { opacity: 0, y: -60 }, to: { opacity: 1, y: 0 } },
  fadeLeft: { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  fadeRight: { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  scaleUp: { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
  blurIn: { from: { opacity: 0, filter: "blur(15px)" }, to: { opacity: 1, filter: "blur(0px)" } },
  rotateIn: { from: { opacity: 0, rotateX: 45, y: 40 }, to: { opacity: 1, rotateX: 0, y: 0 } },
};

export const AnimatedSection = ({
  children,
  className,
  animation = "fadeUp",
  delay = 0,
  duration = 0.8,
  stagger = false,
}: AnimatedSectionProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const config = animationConfigs[animation];
    const element = elementRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { ...config.from, willChange: "transform, opacity" },
        {
          ...config.to,
          duration,
          delay: delay / 1000, // Convert ms to seconds
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [animation, delay, duration]);

  return (
    <div
      ref={elementRef}
      className={cn("will-change-transform", className)}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
};

// Animation variants for backward compatibility
export const animationVariants = {
  visible: "",
  fadeUp: "opacity-0 translate-y-8",
  fadeDown: "opacity-0 -translate-y-8",
  fadeLeft: "opacity-0 -translate-x-8",
  fadeRight: "opacity-0 translate-x-8",
  scaleUp: "opacity-0 scale-95",
};
