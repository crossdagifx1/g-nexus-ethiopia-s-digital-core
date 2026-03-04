import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CategoryTabs } from "@/components/CategoryTabs";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight, Search, TrendingUp, BookOpen, Mail, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";

import { AdBanner } from "@/components/AdBanner";
import { useToast } from "@/hooks/use-toast";

interface BlogPostItem {
  id: string; title: string; excerpt: string | null; category: string | null;
  author_name: string | null; published_at: string | null; image_url: string | null;
}

const stats = [
  { value: 50, suffix: "+", label: "Articles" },
  { value: 10, suffix: "k+", label: "Readers" },
  { value: 15, suffix: "+", label: "Topics" },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (!error && data) setPosts(data as any);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await (supabase.from('newsletter_subscribers' as any) as any).insert([{ email: newsletterEmail }]);
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else if (error.code === 'PGRST204' || error.message?.includes('does not exist')) {
          toast({ title: "Service initializing", description: "The newsletter module is still setting up. Please try again in 5 minutes.", variant: "default" });
        } else throw error;
      } else {
        toast({ title: "Subscribed!", description: "Check your inbox for the latest updates." });
        setNewsletterEmail("");
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      toast({ title: "Subscription failed", description: "Something went wrong. Please try again later.", variant: "destructive" });
    } finally {
      setIsSubscribing(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))];
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <PageHero badge="📝 Blog" title="Insights & Ideas" subtitle="Thoughts on technology, design, and building the future of Ethiopian digital infrastructure." />

      {/* Stats */}
      <section className="py-12 px-6 border-y border-border/30">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100} animation="scaleUp">
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-primary"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/30 border-border/50" />
              </div>
              <CategoryTabs categories={categories} defaultCategory="All" onChange={setSelectedCategory} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {loading ? <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
              <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-semibold text-foreground mb-1">No articles published yet</p>
                    <p className="text-sm">Check back soon — our team is writing great content!</p>
                  </div>
                ) : (
                  filteredPosts.map((post, i) => (
                    <AnimatedSection key={post.id} delay={i * 75} animation="fadeUp">
                      <Link to={`/blog/${post.id}`}>
                        <article className="group p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 cursor-pointer transition-all hover:-translate-y-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {post.category && <span className="text-xs font-medium text-primary uppercase px-2 py-1 rounded-full bg-primary/10 mb-2 inline-block">{post.category}</span>}
                              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                {post.author_name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author_name}</span>}
                                {post.published_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.published_at).toLocaleDateString()}</span>}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                          </div>
                        </article>
                      </Link>
                    </AnimatedSection>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar Ads */}
          <aside className="lg:w-80 space-y-6">
            <AnimatedSection animation="fadeLeft">
              <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <AdBanner placement="sidebar" className="bg-background/90" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeLeft" delay={200}>
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                < TrendingUp className="w-5 h-5 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Popular Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'Ethiopia', 'Fintech', '3D', 'Strategy'].map(tag => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <AnimatedSection>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-6">Join 1,000+ professionals getting weekly insights on Ethiopian digital core development.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-background/50"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                />
                <Button onClick={handleSubscribe} disabled={isSubscribing}>
                  {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
