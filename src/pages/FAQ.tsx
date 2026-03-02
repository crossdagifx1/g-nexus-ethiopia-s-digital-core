import { useState, useEffect } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Search, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface FAQItem { id: string; question: string; answer: string; category: string; }

// Fallback FAQ data
const fallbackFaqs = [
  { id: '1', question: "What services does G-Nexus offer?", answer: "We offer web development, 3D visualization, AI automation, and our flagship G-Nexus platform for Ethiopian SMEs.", category: "General" },
  { id: '2', question: "How much does a typical project cost?", answer: "Project costs vary based on scope. Contact us for a free consultation and custom quote.", category: "Pricing" },
  { id: '3', question: "Do you support local payment methods?", answer: "Yes! G-Nexus integrates with Telebirr, Chapa, and SantimPay for seamless Ethiopian payments.", category: "Platform" },
  { id: '4', question: "How long does a project take?", answer: "Timelines vary: websites take 2-4 weeks, 3D projects 1-2 weeks, and AI solutions 4-8 weeks.", category: "General" },
  { id: '5', question: "Do you offer ongoing support?", answer: "Absolutely! We offer maintenance packages and priority support for all our clients.", category: "Support" },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase.from('faq_items').select('*').eq('is_active', true).order('display_order');
      if (data && data.length > 0) setFaqs(data as any);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];
  const filtered = faqs.filter(f => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageLayout>
      <PageHero badge="❓ FAQ" title="Frequently Asked Questions" subtitle="Find answers to common questions about our services, pricing, and process." />
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search FAQ..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <CategoryTabs categories={categories} defaultCategory="All" onChange={setSelectedCategory} />
            </div>
          </AnimatedSection>
          <AnimatedSection>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filtered.map((faq, i) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border border-border/50 rounded-xl px-6 bg-muted/20">
                    <AccordionTrigger className="font-display font-bold hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
                {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No matching questions found.</div>}
              </Accordion>
            )}
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
