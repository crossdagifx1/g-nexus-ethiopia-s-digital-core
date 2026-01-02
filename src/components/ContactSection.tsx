import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 opacity-0 animate-fade-in">
          Get in Touch
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in animation-delay-100">
          Let's Build{" "}
          <span className="text-gradient-gold">Together</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-200">
          Ready to transform your digital presence? Whether you need a website, 
          3D visualization, or AI automation — we're here to help.
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 opacity-0 animate-fade-in animation-delay-300">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-gold">
              <MapPin className="w-5 h-5" />
            </div>
            <span>Addis Ababa, Ethiopia</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-gold">
              <Mail className="w-5 h-5" />
            </div>
            <span>hello@gsquad.et</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-gold">
              <Phone className="w-5 h-5" />
            </div>
            <span>+251 91 234 5678</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-400">
          <Button variant="hero" size="xl">
            Start a Project
            <Send className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="glass" size="xl">
            Schedule a Call
          </Button>
        </div>
      </div>
    </section>
  );
};
