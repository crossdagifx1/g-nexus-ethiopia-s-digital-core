const footerLinks = {
  Services: ["Web Development", "3D & Architecture", "AI Automation", "G-Nexus"],
  Company: ["About", "Team", "Careers", "Blog"],
  Support: ["Contact", "FAQ", "Documentation", "Status"],
};

export const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-glow flex items-center justify-center">
                <span className="text-background font-display font-bold text-xl">G</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">G-Squad</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building Ethiopia's digital infrastructure through the fusion of 
              ancient wisdom and futuristic technology.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-gold transition-colors duration-300 text-sm">
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
            © 2026 G-Squad. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with <span className="text-gold">♥</span> in Addis Ababa
          </p>
        </div>
      </div>
    </footer>
  );
};
