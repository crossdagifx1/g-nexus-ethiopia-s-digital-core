import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Workflow, Brain, Sparkles, ArrowRight, Zap, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const solutions = [
  {
    icon: <Bot className="w-8 h-8" />,
    title: "Custom AI Agents",
    description: "Intelligent assistants that understand your business context and automate complex workflows.",
    benefits: ["24/7 Customer Support", "Lead Qualification", "Data Processing", "Task Automation"],
    color: "gold",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Telegram Bots",
    description: "Powerful Telegram bots for customer engagement, notifications, and business operations.",
    benefits: ["Order Management", "Appointment Booking", "FAQ Automation", "Payment Integration"],
    color: "cyan",
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "Process Automation",
    description: "End-to-end automation of repetitive business processes using AI-powered workflows.",
    benefits: ["Invoice Processing", "Report Generation", "Email Automation", "Data Sync"],
    color: "gold",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Integration",
    description: "Seamlessly integrate Gemini, GPT, and other AI models into your existing systems.",
    benefits: ["Custom LLM Solutions", "RAG Systems", "Vision AI", "Voice AI"],
    color: "cyan",
  },
];

const useCases = [
  {
    industry: "E-commerce",
    title: "Automated Customer Service",
    description: "AI chatbot handling 80% of customer inquiries, reducing support costs by 60%.",
    metric: "60% Cost Reduction",
  },
  {
    industry: "Real Estate",
    title: "Property Matching Bot",
    description: "Telegram bot that matches buyers with properties based on preferences and budget.",
    metric: "3x Lead Conversion",
  },
  {
    industry: "Healthcare",
    title: "Appointment Scheduling",
    description: "WhatsApp automation for appointment booking, reminders, and follow-ups.",
    metric: "40% No-show Reduction",
  },
  {
    industry: "Finance",
    title: "Document Processing",
    description: "AI-powered extraction and validation of financial documents and invoices.",
    metric: "90% Time Saved",
  },
];

const benefits = [
  { icon: <Clock className="w-6 h-6" />, title: "Save Time", description: "Automate hours of manual work" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Scale Easily", description: "Handle 10x workload without hiring" },
  { icon: <Zap className="w-6 h-6" />, title: "Work 24/7", description: "AI never sleeps, takes breaks, or calls in sick" },
  { icon: <Sparkles className="w-6 h-6" />, title: "Improve Quality", description: "Consistent, error-free operations" },
];

export default function AIAutomation() {
  return (
    <PageLayout>
      <PageHero
        badge="🤖 AI Automation"
        title="Automate the Boring Stuff"
        subtitle="Leverage cutting-edge AI to automate repetitive tasks, enhance customer experiences, and unlock new efficiencies across your business operations."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact">
            <Button variant="gold" size="lg" className="group">
              Book AI Consultation
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="glass" size="lg">See Demo</Button>
        </div>
      </PageHero>

      {/* Benefits Bar */}
      <section className="py-12 px-6 border-y border-border/30 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 100} animation="fadeUp">
                <div className="flex items-start gap-3 group">
                  <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-wider uppercase">Our Solutions</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl mt-4 mb-6">
                AI-Powered <span className="text-gradient-cyber">Automation</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <AnimatedSection key={solution.title} delay={index * 100} animation="fadeUp">
                <div className="group relative h-full p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 hover:border-gold/50 transition-all duration-500">
                  {/* Animated background */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${solution.color === 'gold' ? 'from-gold/5 to-transparent' : 'from-cyan/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl ${solution.color === 'gold' ? 'bg-gold/10 text-gold' : 'bg-cyan/10 text-cyan'} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {solution.icon}
                    </div>
                    
                    <h3 className="font-display font-bold text-xl mb-3">{solution.title}</h3>
                    <p className="text-muted-foreground mb-6">{solution.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {solution.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className={`px-3 py-1 text-xs rounded-full ${solution.color === 'gold' ? 'bg-gold/10 text-gold' : 'bg-cyan/10 text-cyan'}`}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-cyan text-sm font-medium tracking-wider uppercase">Success Stories</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl mt-4">
                Real-World <span className="text-gradient-gold">Results</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <AnimatedSection key={useCase.title} delay={index * 100} animation="scaleUp">
                <div className="group p-6 rounded-2xl border border-border/50 hover:border-gold/50 bg-muted/20 transition-all duration-300">
                  <span className="text-xs font-medium text-gold uppercase tracking-wider">{useCase.industry}</span>
                  <h3 className="font-display font-bold text-lg mt-2 mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 to-cyan/20 border border-gold/30">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span className="text-sm font-bold text-gradient-gold">{useCase.metric}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-wider uppercase">Powered By</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl mt-4">
                Cutting-Edge <span className="text-gradient-cyber">AI Stack</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-4">
            {["Google Gemini", "OpenAI GPT-4", "Anthropic Claude", "LangChain", "Pinecone", "Redis", "Python", "Node.js"].map((tech, index) => (
              <AnimatedSection key={tech} delay={index * 50} animation="scaleUp">
                <div className="px-6 py-3 rounded-xl bg-muted/50 border border-border/50 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group cursor-default">
                  <span className="font-medium group-hover:text-gold transition-colors">{tech}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-gold/10 via-background to-cyan/10 border border-gold/30 overflow-hidden">
              <div className="absolute inset-0 tibeb-pattern opacity-20" />
              
              {/* Floating elements */}
              <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-gold/10 blur-2xl animate-float" />
              <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-cyan/10 blur-2xl animate-pulse-glow" />
              
              <div className="relative z-10">
                <Bot className="w-12 h-12 text-gold mx-auto mb-6 animate-float" />
                <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                  Ready to <span className="text-gradient-cyber">Automate</span> Your Business?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's discuss how AI can transform your operations and give you a competitive edge.
                </p>
                <Link to="/contact">
                  <Button variant="gold" size="lg" className="group">
                    Schedule Free AI Audit
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </PageLayout>
  );
}
