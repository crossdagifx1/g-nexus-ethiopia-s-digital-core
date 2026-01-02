import { ReactNode } from "react";
import { useScrollAnimation, animationVariants } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: keyof typeof animationVariants;
  delay?: number;
  duration?: number;
}

export const AnimatedSection = ({
  children,
  className,
  animation = "fadeUp",
  delay = 0,
  duration = 700,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? animationVariants.visible : animationVariants[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
