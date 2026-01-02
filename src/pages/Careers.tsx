import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Rocket, Heart, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const positions = [
  { title: "Senior React Developer", type: "Full-time", location: "Addis Ababa / Remote" },
  { title: "3D Artist / ArchViz Specialist", type: "Full-time", location: "Addis Ababa" },
  { title: "AI/ML Engineer", type: "Contract", location: "Remote" },
];

export default function Careers() {
  return (
    <PageLayout>
      <PageHero badge="🚀 Careers" title="Join the Squad" subtitle="Help us build Ethiopia's digital future. We're looking for passionate builders who want to make an impact." />
      <section className="py-16 px-6 border-y border-border/30">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
          {[{ icon: <Rocket />, text: "Work on exciting projects" }, { icon: <Heart />, text: "Great team culture" }, { icon: <Coffee />, text: "Free Ethiopian coffee" }].map((perk, i) => (
            <AnimatedSection key={i} delay={i * 100} animation="fadeUp">
              <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gold/10 text-gold">{perk.icon}</div><span>{perk.text}</span></div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-2xl mb-8 text-center">Open Positions</h2></AnimatedSection>
          <div className="space-y-4">
            {positions.map((pos, i) => (
              <AnimatedSection key={pos.title} delay={i * 100} animation="fadeUp">
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-gold/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div><h3 className="font-bold">{pos.title}</h3><p className="text-sm text-muted-foreground">{pos.type} • {pos.location}</p></div>
                  <Link to="/contact"><Button variant="gold" size="sm">Apply Now</Button></Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
