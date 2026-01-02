import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Target, Eye, Heart } from "lucide-react";

export default function About() {
  return (
    <PageLayout>
      <PageHero badge="🏛️ About Us" title="Ancient Wisdom, Future Tech" subtitle="We're building Ethiopia's digital infrastructure by blending the wisdom of our ancestors with cutting-edge technology." />
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="w-8 h-8" />, title: "Our Mission", desc: "Empower Ethiopian SMEs with world-class digital tools that respect local context and enable global reach." },
            { icon: <Eye className="w-8 h-8" />, title: "Our Vision", desc: "To be the backbone of East Africa's digital economy, one business at a time." },
            { icon: <Heart className="w-8 h-8" />, title: "Our Values", desc: "Innovation with integrity. Technology with purpose. Growth with community." },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 100} animation="fadeUp">
              <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-6">{item.icon}</div>
                <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
