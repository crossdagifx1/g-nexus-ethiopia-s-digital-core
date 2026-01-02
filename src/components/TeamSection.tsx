import { Linkedin, Github } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  expertise: string;
  quote: string;
  index: number;
}

const TeamMember = ({ name, role, expertise, quote, index }: TeamMemberProps) => (
  <div 
    className="group relative opacity-0 animate-fade-in"
    style={{ animationDelay: `${index * 150 + 200}ms` }}
  >
    <div className="relative p-8 rounded-2xl glass border-glow overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Avatar Placeholder */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-cyan/20 mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <span className="text-3xl font-display font-bold text-gold">
            {name.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <h3 className="text-xl font-display font-bold text-foreground mb-1 group-hover:text-gold transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gold text-sm font-medium mb-2">{role}</p>
        <p className="text-muted-foreground text-sm mb-4">{expertise}</p>
        
        {/* Quote */}
        <blockquote className="text-muted-foreground italic border-l-2 border-gold/30 pl-4 text-sm">
          "{quote}"
        </blockquote>

        {/* Social Links */}
        <div className="flex gap-3 mt-6">
          <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-gold/20 hover:text-gold transition-all duration-300">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-gold/20 hover:text-gold transition-all duration-300">
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const team = [
  {
    name: "Dagmawi Amare",
    role: "Founder & Lead Developer",
    expertise: "Full-Stack, AI Agents, API Integration",
    quote: "Let's build this efficiently. How can we use AI to make this smarter?",
  },
  {
    name: "Tsion Berihun",
    role: "Co-Founder & Creative Director",
    expertise: "3D Visualization, ArchViz, UI/UX",
    quote: "It needs to look premium. Let's make the user flow intuitive and beautiful.",
  },
  {
    name: "Yafet Abraham",
    role: "Co-Founder & Business Strategist",
    expertise: "Market Strategy, Growth, Client Relations",
    quote: "What's the ROI? This needs a clear value proposition.",
  },
];

export const TeamSection = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 tibeb-pattern" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6 opacity-0 animate-fade-in">
            The Squad
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 opacity-0 animate-fade-in animation-delay-100">
            Meet the{" "}
            <span className="text-gradient-cyber">Founders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-200">
            Three visionaries united by a mission to transform Ethiopia's digital landscape.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <TeamMember key={member.name} {...member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
