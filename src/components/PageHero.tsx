import { ReactNode } from "react";
import { AnimatedSection } from "./AnimatedSection";

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  children?: ReactNode;
}

export const PageHero = ({ title, subtitle, badge, children }: PageHeroProps) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tibeb-pattern opacity-30" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-float" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {badge && (
          <AnimatedSection animation="scaleUp">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-6">
              {badge}
            </span>
          </AnimatedSection>
        )}
        
        <AnimatedSection delay={100}>
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="text-gradient-gold">{title}</span>
          </h1>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </AnimatedSection>
        
        {children && (
          <AnimatedSection delay={300}>
            <div className="mt-8">{children}</div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};
