import { useState, useEffect } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SkillProgressBar } from "@/components/SkillProgressBar";

import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Code, Palette, Linkedin, Twitter, Github, Globe, Coffee, Lightbulb, Users, Heart, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const fallbackTeam = [
  { 
    id: '1', name: "Dagmawi Amare", role: "Lead Developer & Co-Founder", 
    bio: "Full-Stack wizard with 5+ years of experience. AI enthusiast who automates the boring stuff.",
    skills: [{ name: "React/TypeScript", level: 95 }, { name: "Node.js/Python", level: 90 }, { name: "AI/ML Integration", level: 85 }, { name: "System Architecture", level: 88 }],
    social_links: { linkedin: "#", twitter: "#", github: "#" },
    fun_fact: "Consumes 5+ cups of Ethiopian coffee daily", avatar_url: null,
  },
  { 
    id: '2', name: "Tsion Berihun", role: "Creative Director & Co-Founder", 
    bio: "3D visualization expert and pixel perfectionist with an eye for detail.",
    skills: [{ name: "3D Modeling/Rendering", level: 98 }, { name: "UI/UX Design", level: 92 }, { name: "Motion Graphics", level: 88 }, { name: "Brand Strategy", level: 85 }],
    social_links: { linkedin: "#", twitter: "#", github: "#" },
    fun_fact: "Has a collection of 200+ traditional patterns", avatar_url: null,
  },
];

const teamValues = [
  { icon: <Lightbulb className="w-6 h-6" />, title: "Innovation First", desc: "We challenge conventions and embrace creative solutions." },
  { icon: <Users className="w-6 h-6" />, title: "Collaboration", desc: "The best ideas emerge from diverse perspectives working together." },
  { icon: <Heart className="w-6 h-6" />, title: "Passion", desc: "We genuinely care about the success of every project and client." },
  { icon: <Coffee className="w-6 h-6" />, title: "Ethiopian Pride", desc: "We celebrate our heritage while building for the future." },
];

const dayInLife = [
  { time: "6:00 AM", activity: "Morning coffee ceremony & planning", emoji: "☕" },
  { time: "8:00 AM", activity: "Team standup & priority alignment", emoji: "🎯" },
  { time: "9:00 AM", activity: "Deep work: coding, designing, creating", emoji: "💻" },
  { time: "12:00 PM", activity: "Lunch & cultural exchange", emoji: "🍽️" },
  { time: "2:00 PM", activity: "Client meetings & collaboration", emoji: "🤝" },
  { time: "5:00 PM", activity: "Review, iterate, improve", emoji: "🔄" },
  { time: "6:00 PM", activity: "Learning & skill development", emoji: "📚" },
];

const testimonials = [
  { quote: "Working with Dagi and Tsion transformed our business.", author: "Abebe Kebede", role: "CEO", company: "TechEthiopia", rating: 5 },
  { quote: "They're not just developers, they're true partners in success.", author: "Sara Hailu", role: "Founder", company: "Addis Eats", rating: 5 },
  { quote: "The best tech team in Ethiopia, hands down.", author: "Yonas Tadesse", role: "CTO", company: "PayEthio", rating: 5 },
];

interface TeamMember { id: string; name: string; role: string; bio: string | null; avatar_url: string | null; skills: any; social_links: any; fun_fact: string | null; }

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase.from('team_members').select('*').eq('is_active', true).order('display_order');
      if (data && data.length > 0) setTeam(data as any);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const iconForIndex = (i: number) => i % 2 === 0 ? <Code className="w-8 h-8" /> : <Palette className="w-8 h-8" />;

  return (
    <PageLayout>
      <PageHero badge="👥 Our Team" title="Meet the Squad" subtitle="Expert founders united by a shared vision: to digitize Ethiopia's future." />

      {/* Team Values */}
      <section className="py-16 px-6 border-y border-border/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {teamValues.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 100} animation="fadeUp">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">{value.icon}</div>
                <h3 className="font-display font-bold text-sm mb-1">{value.title}</h3><p className="text-xs text-muted-foreground">{value.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Team Members */}
      <section className="py-24 px-6 relative">
        
        {loading ? <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
          <div className="max-w-6xl mx-auto space-y-24">
            {team.map((member, i) => {
              const skills = Array.isArray(member.skills) ? member.skills : [];
              const social = member.social_links && typeof member.social_links === 'object' ? member.social_links : {};
              return (
                <AnimatedSection key={member.id} delay={i * 200} animation={i % 2 === 0 ? "fadeLeft" : "fadeRight"}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center`}>
                    <div className={`order-2 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="group p-8 rounded-3xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all">
                        <div className="flex items-start gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {member.avatar_url ? <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-2xl object-cover" /> : iconForIndex(i)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-2xl">{member.name}</h3>
                            <p className="text-primary text-sm mb-3">{member.role}</p>
                            <p className="text-muted-foreground text-sm">{member.bio}</p>
                            <div className="flex gap-3 mt-4">
                              {social.linkedin && <a href={social.linkedin} className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-colors"><Linkedin className="w-4 h-4" /></a>}
                              {social.twitter && <a href={social.twitter} className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-colors"><Twitter className="w-4 h-4" /></a>}
                              {social.github && <a href={social.github} className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-colors"><Github className="w-4 h-4" /></a>}
                            </div>
                          </div>
                        </div>
                        {member.fun_fact && <div className="mt-4 flex items-center gap-2 text-sm"><span className="text-primary">⚡</span><span className="text-muted-foreground">Fun fact: {member.fun_fact}</span></div>}
                      </div>
                    </div>
                    <div className={`order-1 ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                      <h4 className="font-display font-bold text-lg mb-6">Core Expertise</h4>
                      <div className="space-y-5">
                        {skills.map((skill: any, j: number) => (
                          <SkillProgressBar key={skill.name || j} label={skill.name} percentage={skill.level} color={j % 2 === 0 ? "gold" : "cyan"} delay={j * 100} />
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </section>

      {/* Day in Life */}
      <section className="py-24 px-6 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-4">A Day at G-Squad</h2><p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">How we blend Ethiopian traditions with modern productivity.</p></AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dayInLife.map((item, i) => (
              <AnimatedSection key={item.time} delay={i * 100} animation="scaleUp">
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors text-center">
                  <span className="text-3xl mb-2 block">{item.emoji}</span><p className="text-primary font-mono text-sm mb-1">{item.time}</p><p className="text-sm text-muted-foreground">{item.activity}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection><h2 className="font-display font-bold text-3xl text-center mb-12">What Clients Say</h2></AnimatedSection>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display font-bold text-3xl mb-4">Want to Join the Squad?</h2>
            <p className="text-muted-foreground mb-6">We're always looking for passionate builders who share our vision.</p>
            <a href="/careers" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform">View Open Positions</a>
          </div>
        </AnimatedSection>
      </section>
    </PageLayout>
  );
}
