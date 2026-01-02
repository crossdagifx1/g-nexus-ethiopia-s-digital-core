import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Calendar } from "lucide-react";

const posts = [
  { title: "How AI is Transforming Ethiopian Business", date: "Jan 2, 2026", category: "AI" },
  { title: "The Rise of Digital Payments in East Africa", date: "Dec 28, 2025", category: "Fintech" },
  { title: "Building for Scale: Lessons from G-Nexus", date: "Dec 20, 2025", category: "Engineering" },
  { title: "3D Visualization Trends for 2026", date: "Dec 15, 2025", category: "Design" },
];

export default function Blog() {
  return (
    <PageLayout>
      <PageHero badge="📝 Blog" title="Insights & Ideas" subtitle="Thoughts on technology, design, and building the future of Ethiopian digital infrastructure." />
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.title} delay={i * 100} animation="fadeUp">
              <article className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-gold/50 cursor-pointer transition-all group">
                <span className="text-xs font-medium text-gold uppercase">{post.category}</span>
                <h2 className="font-display font-bold text-xl mt-2 mb-3 group-hover:text-gold transition-colors">{post.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />{post.date}</div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
