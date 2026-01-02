import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <PageLayout>
      <PageHero badge="📬 Contact" title="Let's Build Together" subtitle="Have a project in mind? We'd love to hear from you. Reach out and let's create something extraordinary." />
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fadeUp">
            <div className="space-y-8">
              <div><h3 className="font-display font-bold text-2xl mb-6">Get in Touch</h3><p className="text-muted-foreground">Ready to start your digital transformation journey? Fill out the form and we'll get back to you within 24 hours.</p></div>
              <div className="space-y-4">
                {[{ icon: <Mail />, label: "hello@gnexuset.com" }, { icon: <Phone />, label: "+251 91 234 5678" }, { icon: <MapPin />, label: "Addis Ababa, Ethiopia" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gold/10 text-gold">{item.icon}</div><span>{item.label}</span></div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <form className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-6">
              <div className="grid md:grid-cols-2 gap-4"><Input placeholder="Your Name" className="bg-background/50" /><Input placeholder="Email" type="email" className="bg-background/50" /></div>
              <Input placeholder="Subject" className="bg-background/50" />
              <Textarea placeholder="Your Message" rows={5} className="bg-background/50" />
              <Button variant="gold" className="w-full group">Send Message <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
