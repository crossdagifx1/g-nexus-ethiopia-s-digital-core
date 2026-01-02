import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Code, Palette, Linkedin, Twitter } from "lucide-react";

const team = [
  { name: "Dagmawi Amare", role: "Lead Developer", icon: <Code className="w-6 h-6" />, bio: "Full-Stack wizard. AI enthusiast. Automates the boring stuff." },
  { name: "Tsion Berihun", role: "Creative Director", icon: <Palette className="w-6 h-6" />, bio: "3D visualization expert. Pixel perfectionist. Design is in the details." },
];

export default function Team() {
  return (
    <PageLayout>
      <PageHero badge="👥 Our Team" title="Meet the Squad" subtitle="Two expert founders united by a shared vision: to digitize Ethiopia's future." />
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 150} animation="scaleUp">
              <div className="group p-8 rounded-3xl bg-muted/30 border border-border/50 hover:border-gold/50 transition-all text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-cyan/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">{member.icon}</span>
                </div>
                <h3 className="font-display font-bold text-xl">{member.name}</h3>
                <p className="text-gold text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-gold/20 transition-colors"><Linkedin className="w-4 h-4" /></a>
                  <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-gold/20 transition-colors"><Twitter className="w-4 h-4" /></a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
