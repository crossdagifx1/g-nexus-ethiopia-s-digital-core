import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";

const features = [
  { icon: <Zap className="w-5 h-5" />, text: "ERP & CRM for SMEs" },
  { icon: <Shield className="w-5 h-5" />, text: "Telebirr & Chapa Integration" },
  { icon: <TrendingUp className="w-5 h-5" />, text: "AI-Powered Insights" },
  { icon: <CheckCircle className="w-5 h-5" />, text: "Drag-and-Drop Builder" },
];

export const GNexusSection = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-cyan/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="opacity-0 animate-fade-in-left">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              Flagship Product
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              <span className="text-gradient-gold">G-Nexus</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-normal">
                Ethiopia's Digital Operating System
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              The all-in-one platform designed for Ethiopian SMEs. Manage customers, 
              inventory, websites, and payments from a single beautiful dashboard — 
              powered by AI that understands your business.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={feature.text}
                  className="flex items-center gap-3 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <div className="text-gold">{feature.icon}</div>
                  <span className="text-foreground text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Get Early Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative opacity-0 animate-fade-in-right animation-delay-200">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Card */}
              <div className="absolute inset-4 rounded-3xl glass border-glow p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-glow flex items-center justify-center">
                      <span className="text-background font-bold text-lg">G</span>
                    </div>
                    <span className="font-display font-bold text-xl text-foreground">G-Nexus</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-muted rounded-full w-3/4" />
                    <div className="h-3 bg-muted rounded-full w-1/2" />
                    <div className="h-3 bg-muted rounded-full w-2/3" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-gold">147</div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-cyan">89%</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                </div>
              </div>

              {/* Decorative Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-gold/20 rounded-3xl animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
