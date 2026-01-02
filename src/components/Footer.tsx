import { Sparkles, Github, Linkedin, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  Services: ["Web Development", "3D & Architecture", "AI Automation", "G-Nexus Platform"],
  Company: ["About Us", "Our Team", "Careers", "Blog"],
  Support: ["Contact", "FAQ", "Documentation", "Status"],
};

const socialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
  { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
];

export const Footer = () => {
  return (
    <footer className="relative py-20 px-6 border-t border-border/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-glow flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-background font-display font-bold text-xl">G</span>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan animate-pulse-glow" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-foreground">G-Nexus</span>
                <p className="text-xs text-muted-foreground">by G-Squad</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Building Ethiopia's digital infrastructure through the fusion of 
              ancient wisdom and futuristic technology. Join us in shaping the future.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-gold/20 hover:text-gold hover:scale-110 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-foreground mb-6">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-gold transition-colors duration-300 text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-gold group-hover:w-3 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 G-Nexus. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Made with <span className="text-gold animate-pulse">♥</span> in 
            <span className="text-gold">Addis Ababa</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
