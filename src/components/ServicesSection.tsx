import { Code, Palette, Brain, LayoutGrid, ArrowRight } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => (
  <div 
    className="group relative p-8 rounded-2xl glass border-glow opacity-0 animate-fade-in"
    style={{ animationDelay: `${index * 100 + 200}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <div className="text-gold group-hover:text-cyan transition-colors duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
        <span className="text-sm font-medium">Learn more</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  </div>
);

const services = [
  {
    icon: <Code className="w-6 h-6" />,
    title: "Web Development",
    description: "Custom SaaS platforms, landing pages, and e-commerce solutions with native Telebirr integration for the Ethiopian market.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "3D & Architecture",
    description: "Photorealistic ArchViz, product rendering, and immersive virtual tours that bring your vision to life.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Automation",
    description: "Intelligent Telegram bots, AI coding agents, and business process automation powered by cutting-edge technology.",
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "G-Nexus Platform",
    description: "All-in-one business management SaaS designed specifically for Ethiopian SMEs to thrive in the digital age.",
  },
];

export const ServicesSection = () => {
  return (
    <section className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 opacity-0 animate-fade-in">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in animation-delay-100">
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
