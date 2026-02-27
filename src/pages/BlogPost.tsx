import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

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
            <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">{post.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              {post.author_name && <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author_name}</span>}
              {post.published_at && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>}
            </div>
            {post.image_url && <img src={post.image_url} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-96" />}
            <div className="prose prose-invert max-w-none">
              {post.content ? post.content.split('\n').map((p, i) => <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>) : <p className="text-muted-foreground">{post.excerpt}</p>}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
