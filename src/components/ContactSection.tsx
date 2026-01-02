import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send, MessageCircle, Calendar, Sparkles } from "lucide-react";

const contactMethods = [
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Addis Ababa, Ethiopia" },
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@gnexus.et" },
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+251 91 234 5678" },
];

export const ContactSection = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-background" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan/5 rounded-full blur-3xl animate-float animation-delay-500" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 opacity-0 animate-fade-in animate-pulse-glow">
            <Sparkles className="w-4 h-4" />
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in animation-delay-100">
            Let's Build{" "}
            <span className="text-gradient-gold">Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-200">
            Ready to transform your digital presence? Whether you need a website, 
            3D visualization, or AI automation — we're here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={method.label}
              className="group p-6 rounded-2xl glass border-glow text-center hover:scale-105 transition-all duration-500 opacity-0 animate-fade-in cursor-default"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-cyan/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <div className="text-gold group-hover:text-cyan transition-colors duration-300">
                  {method.icon}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{method.label}</p>
              <p className="text-foreground font-medium group-hover:text-gold transition-colors duration-300">{method.value}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-500">
          <Button variant="hero" size="xl" className="group">
            <MessageCircle className="w-5 h-5 mr-2" />
            Start a Project
            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
          <Button variant="glass" size="xl" className="group">
            <Calendar className="w-5 h-5 mr-2 group-hover:text-gold transition-colors duration-300" />
            Schedule a Call
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-10 border-t border-border/30">
          <p className="text-center text-muted-foreground text-sm mb-8 opacity-0 animate-fade-in animation-delay-500">
            Trusted by innovative businesses across Ethiopia
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-0 animate-fade-in animation-delay-500">
            {["Telebirr", "Chapa", "SantimPay", "Yegara"].map((partner, index) => (
              <div
                key={partner}
                className="px-6 py-3 rounded-lg bg-muted/30 text-muted-foreground font-medium hover:bg-gold/10 hover:text-gold transition-all duration-300 cursor-default"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
