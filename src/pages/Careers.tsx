import { useState, useEffect } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CategoryTabs } from "@/components/CategoryTabs";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { FloatingParticles } from "@/components/FloatingParticles";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { Rocket, Heart, Coffee, Globe, Zap, BookOpen, Users, Clock, MapPin, Briefcase, GraduationCap, Wifi, Dumbbell, Plane, DollarSign, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const benefits = [
  { icon: <Coffee className="w-6 h-6" />, title: "Free Ethiopian Coffee", desc: "Unlimited access to premium Ethiopian coffee daily" },
  { icon: <Wifi className="w-6 h-6" />, title: "Remote Flexibility", desc: "Work from anywhere with flexible hours" },
  { icon: <BookOpen className="w-6 h-6" />, title: "Learning Budget", desc: "$500/year for courses, books, and conferences" },
  { icon: <Dumbbell className="w-6 h-6" />, title: "Health & Wellness", desc: "Gym membership and mental health support" },
  { icon: <Plane className="w-6 h-6" />, title: "Paid Time Off", desc: "25 days PTO plus Ethiopian holidays" },
  { icon: <DollarSign className="w-6 h-6" />, title: "Competitive Salary", desc: "Top-tier Ethiopian tech salaries + bonuses" },
  { icon: <Users className="w-6 h-6" />, title: "Team Events", desc: "Monthly team outings and annual retreats" },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Career Growth", desc: "Clear paths for advancement and mentorship" },
];

interface Position { id: string; title: string; department: string; type: string; location: string | null; description: string | null; requirements: any; }

const fallbackPositions = [
  { id: '1', title: "Senior React Developer", type: "Full-time", location: "Addis Ababa / Remote", department: "Engineering", description: "Build cutting-edge web applications.", requirements: ["5+ years React", "TypeScript", "API integration"] },
  { id: '2', title: "3D Artist", type: "Full-time", location: "Addis Ababa", department: "Design", description: "Create stunning 3D visualizations.", requirements: ["Blender/3DS Max", "Strong portfolio"] },
  { id: '3', title: "AI/ML Engineer", type: "Contract", location: "Remote", department: "Engineering", description: "Integrate AI into G-Nexus.", requirements: ["Python/TensorFlow", "NLP", "Production ML"] },
];

const applicationProcess = [
  { step: 1, title: "Apply Online", desc: "Submit your resume and portfolio", duration: "5 min" },
  { step: 2, title: "Initial Screen", desc: "Quick call to discuss your background", duration: "30 min" },
  { step: 3, title: "Technical Challenge", desc: "Practical task relevant to the role", duration: "2-4 hrs" },
  { step: 4, title: "Team Interview", desc: "Meet the team and culture fit", duration: "1 hr" },
  { step: 5, title: "Offer", desc: "Receive your offer and join!", duration: "🎉" },
];

const employeeTestimonials = [
  { quote: "Joining G-Squad was the best career decision I made.", author: "Hana M.", role: "Senior Developer", rating: 5 },
  { quote: "Nowhere else has the same family feel combined with world-class challenges.", author: "Dawit T.", role: "Designer", rating: 5 },
  { quote: "I've grown more in one year here than in my previous five years combined.", author: "Meron A.", role: "AI Engineer", rating: 5 },
];

const stats = [
  { value: 95, suffix: "%", label: "Employee Satisfaction" },
  { value: 2, suffix: " weeks", label: "Avg. Hiring Time" },
  { value: 4.9, suffix: "/5", label: "Glassdoor Rating" },
  { value: 15, suffix: "+", label: "Countries Represented" },
];

export default function Careers() {
  const [positions, setPositions] = useState<Position[]>(fallbackPositions);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    const fetchPositions = async () => {
      const { data } = await supabase.from('career_positions').select('*').eq('status', 'open').order('created_at', { ascending: false });
      if (data && data.length > 0) setPositions(data as any);
      setLoading(false);
    };
    fetchPositions();
  }, []);

  const departments = ["All", ...Array.from(new Set(positions.map(p => p.department)))];
  const filteredPositions = selectedDepartment === "All" ? positions : positions.filter(p => p.department === selectedDepartment);

  return (
    <PageLayout>
      <PageHero badge="🚀 Careers" title="Join the Squad" subtitle="Help us build Ethiopia's digital future." />

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/30 relative overflow-hidden">
        <FloatingParticles count={12} color="gold" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100} animation="scaleUp">
              <div className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl text-primary mb-1">
                  {typeof stat.value === "number" && stat.value % 1 === 0 ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : <span>{stat.value}{stat.suffix}</span>}
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-4">Why Work With Us</h2><p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">We invest in our team because your success is our success.</p></AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 75} animation="fadeUp">
                <div className="group p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
                  <h3 className="font-display font-bold mb-2">{b.title}</h3><p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-12">How to Join</h2></AnimatedSection>
          <div className="flex flex-col md:flex-row gap-4">
            {applicationProcess.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 100} animation="fadeUp" className="flex-1">
                <div className="relative p-6 rounded-2xl bg-card/50 border border-border/50 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4">{step.step}</div>
                  <h3 className="font-display font-bold mb-2">{step.title}</h3><p className="text-sm text-muted-foreground mb-2">{step.desc}</p><span className="text-xs text-primary">{step.duration}</span>
                  {i < applicationProcess.length - 1 && <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 z-10" />}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-12">From Our Team</h2></AnimatedSection>
          <TestimonialCarousel testimonials={employeeTestimonials} />
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-4">Open Positions</h2><p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">Find your perfect role.</p></AnimatedSection>
          <AnimatedSection delay={100}>
            <CategoryTabs categories={departments} defaultCategory="All" onChange={setSelectedDepartment} className="mb-8" />
          </AnimatedSection>
          {loading ? <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
            <div className="space-y-4">
              {filteredPositions.map((pos, i) => (
                <AnimatedSection key={pos.id} delay={i * 100} animation="fadeUp">
                  <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">{pos.title}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{pos.department}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {pos.type}</span>
                          {pos.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {pos.location}</span>}
                        </div>
                        {pos.description && <p className="text-sm text-muted-foreground mb-3">{pos.description}</p>}
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(pos.requirements) ? pos.requirements : []).map((req: string, j: number) => (
                            <span key={j} className="flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="w-3 h-3 text-primary" /> {req}</span>
                          ))}
                        </div>
                      </div>
                      <Link to="/contact"><Button className="group-hover:scale-105 transition-transform">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* No Fit CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="font-display font-bold text-3xl mb-4">Don't See a Perfect Fit?</h2>
            <p className="text-muted-foreground mb-6">Send us your resume and let's explore how you can contribute.</p>
            <Link to="/contact"><Button size="lg">Send Open Application</Button></Link>
          </div>
        </AnimatedSection>
      </section>
    </PageLayout>
  );
}
