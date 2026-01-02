import { Code, Palette, Brain, LayoutGrid, ArrowRight, Sparkles } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}

const ServiceCard = ({ icon, title, description, features, index }: ServiceCardProps) => (
  <div 
    className="group relative p-8 rounded-2xl glass border-glow opacity-0 animate-fade-in hover:scale-[1.02] transition-all duration-500"
    style={{ animationDelay: `${index * 100 + 200}ms` }}
  >
    {/* Hover Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-cyan/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Animated Corner Accents */}
    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/50 rounded-tl-2xl transition-all duration-500" />
    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan/0 group-hover:border-cyan/50 rounded-br-2xl transition-all duration-500" />
    
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
        <div className="text-gold group-hover:text-cyan transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-6">
        {description}
      </p>
      
      {/* Features List */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <span className="text-sm font-medium">Learn more</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  </div>
);

const services = [
  {
    icon: <Code className="w-7 h-7" />,
    title: "Web Development",
    description: "Custom SaaS platforms, landing pages, and e-commerce solutions with native Telebirr integration.",
    features: ["React & Next.js", "Telebirr & Chapa", "Responsive Design"],
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: "3D & Architecture",
    description: "Photorealistic ArchViz, product rendering, and immersive virtual tours that bring vision to life.",
    features: ["High-Fidelity Renders", "Virtual Tours", "Product Visualization"],
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: "AI Automation",
    description: "Intelligent Telegram bots, AI coding agents, and business process automation powered by cutting-edge tech.",
    features: ["Custom AI Agents", "Process Automation", "Smart Integrations"],
  },
  {
    icon: <LayoutGrid className="w-7 h-7" />,
    title: "G-Nexus Platform",
    description: "All-in-one business management SaaS designed specifically for Ethiopian SMEs to thrive digitally.",
    features: ["ERP & CRM", "Website Builder", "AI Assistant"],
  },
];

export const ServicesSection = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl animate-float animation-delay-300" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 opacity-0 animate-fade-in animate-pulse-glow">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in animation-delay-100">
            Building Ethiopia's{" "}
            <span className="text-gradient-gold">Digital Future</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-200">
            From web development to AI automation, we deliver premium digital solutions 
            that blend ancient wisdom with futuristic technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
