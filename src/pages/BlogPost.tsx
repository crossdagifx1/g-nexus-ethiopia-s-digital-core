import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

import ReactMarkdown from 'react-markdown';

interface BlogPostData {
  id: string; title: string; content: string | null; excerpt: string | null;
  category: string | null; author_name: string | null; published_at: string | null;
  image_url: string | null;
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      setPost(data as any);
      setLoading(false);
    };
    if (id) fetchPost();
  }, [id]);

  if (loading) return <PageLayout><div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div></PageLayout>;
  if (!post) return <PageLayout><div className="min-h-screen flex items-center justify-center flex-col gap-4"><h1 className="text-2xl font-bold">Post not found</h1><Link to="/blog"><Button>Back to Blog</Button></Link></div></PageLayout>;

  return (
    <PageLayout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            {post.category && <Badge variant="outline" className="mb-4">{post.category}</Badge>}
            <h1 className="font-display font-bold text-3xl md:text-5xl mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              {post.author_name && <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author_name}</span>}
              {post.published_at && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>}
            </div>
            {post.image_url && <img src={post.image_url} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-96 shadow-2xl" />}
            <div className="prose prose-invert prose-amber max-w-none">
              {post.content ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-6 text-lg">{children}</p>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-6 text-foreground border-b border-border/50 pb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 text-muted-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-muted-foreground">{children}</ol>,
                    li: ({ children }) => <li className="ml-4">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-6 py-2 italic my-8 bg-primary/5 rounded-r-lg">{children}</blockquote>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed italic">{post.excerpt}</p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
