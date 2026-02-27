import { useState, useEffect } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Book, ExternalLink, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';

const fallbackDocs = [
  { id: '1', title: "Getting Started with G-Nexus", description: "Quick setup guide for new users", category: "General" },
  { id: '2', title: "Payment Integration Guide", description: "Connect Telebirr, Chapa, and more", category: "Integration" },
  { id: '3', title: "API Reference", description: "Full API documentation for developers", category: "Developer" },
  { id: '4', title: "Dashboard Customization", description: "Personalize your G-Nexus experience", category: "General" },
];

interface DocEntry { id: string; title: string; description: string | null; category: string; }

export default function Documentation() {
  const [docs, setDocs] = useState<DocEntry[]>(fallbackDocs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase.from('documentation_entries').select('*').eq('is_active', true).order('display_order');
      if (data && data.length > 0) setDocs(data as any);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  const filtered = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || (d.description || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <PageLayout>
      <PageHero badge="📚 Documentation" title="Documentation" subtitle="Everything you need to get the most out of G-Nexus and our services." />
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documentation..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </AnimatedSection>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((doc, i) => (
                <AnimatedSection key={doc.id} delay={i * 100} animation="fadeUp">
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 cursor-pointer transition-all group">
                    <div className="flex items-start justify-between">
                      <Book className="w-8 h-8 text-primary mb-4" />
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-display font-bold mb-2">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </AnimatedSection>
              ))}
              {filtered.length === 0 && <div className="col-span-2 text-center py-8 text-muted-foreground">No documentation found.</div>}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
