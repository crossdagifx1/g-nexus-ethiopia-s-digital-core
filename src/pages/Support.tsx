import { useState } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, MessageCircle, Headphones, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Support() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', priority: 'normal' });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('support_tickets').insert({
      name: form.name, email: form.email, subject: form.subject || null, message: form.message, priority: form.priority,
    });
    setLoading(false);
    if (error) { toast({ title: 'Error submitting ticket', variant: 'destructive' }); return; }
    toast({ title: 'Ticket submitted!', description: "We'll get back to you within 24 hours." });
    setForm({ name: '', email: '', subject: '', message: '', priority: 'normal' });
  };

  return (
    <PageLayout>
      <PageHero badge="🎧 Support" title="How Can We Help?" subtitle="Get in touch with our support team. We're here to assist you with any questions." />

      {/* Quick Links */}
      <section className="py-16 px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: <MessageCircle className="w-8 h-8" />, title: "Live Chat", desc: "Chat with our AI assistant", action: "Open Chat", href: "#" },
            { icon: <BookOpen className="w-8 h-8" />, title: "Documentation", desc: "Browse our guides & docs", action: "View Docs", href: "/documentation" },
            { icon: <Headphones className="w-8 h-8" />, title: "FAQ", desc: "Find quick answers", action: "View FAQ", href: "/faq" },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 100} animation="fadeUp">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-display font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Link to={item.href}><Button variant="outline" size="sm">{item.action}</Button></Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fadeUp">
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-2xl mb-4">Contact Information</h3>
                <p className="text-muted-foreground">Reach out through any of these channels or submit a support ticket.</p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5" />, label: "hello@gnexuset.com" },
                  { icon: <Phone className="w-5 h-5" />, label: "+251 91 234 5678" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Addis Ababa, Ethiopia" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-muted/30 border border-border/50 space-y-4">
              <h3 className="font-display font-bold text-xl mb-2">Submit a Ticket</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Your Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-background/50" />
                <Input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-background/50" />
              </div>
              <Input placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="bg-background/50" />
              <Select value={form.priority} onValueChange={v => setForm({...form, priority: v})}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Describe your issue *" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="bg-background/50" />
              <Button variant="gold" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" />Submit Ticket</>}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
