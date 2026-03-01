import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Eye, FileText, Sparkles, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { logActivity } from '@/lib/activityLogger';

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  image_url: string | null;
  status: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
}

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: '', image_url: '', status: 'draft', author_name: '' });
  const [aiForm, setAiForm] = useState({ topic: '', tone: 'Professional', keywords: '', length: 'medium' });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) || []);
  };

  const handleSave = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const payload = {
      title: form.title,
      content: form.content || null,
      excerpt: form.excerpt || null,
      category: form.category || null,
      image_url: form.image_url || null,
      status: form.status,
      author_name: form.author_name || user?.email || null,
      author_id: user?.id,
      published_at: form.status === 'published' && !editingPost?.published_at ? new Date().toISOString() : undefined,
    };

    if (editingPost) {
      await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
      await logActivity('Updated blog post', 'blog_post', editingPost.id, { title: form.title });
      toast({ title: 'Post updated' });
    } else {
      await supabase.from('blog_posts').insert([payload]);
      await logActivity('Created blog post', 'blog_post', undefined, { title: form.title });
      toast({ title: 'Post created' });
    }
    setDialogOpen(false);
    setEditingPost(null);
    setForm({ title: '', content: '', excerpt: '', category: '', image_url: '', status: 'draft', author_name: '' });
    fetchPosts();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content || '', excerpt: post.excerpt || '', category: post.category || '', image_url: post.image_url || '', status: post.status || 'draft', author_name: post.author_name || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    await logActivity('Deleted blog post', 'blog_post', id);
    toast({ title: 'Post deleted' });
    fetchPosts();
  };

  const handleAIGenerate = async () => {
    if (!aiForm.topic) { toast({ title: 'Enter a topic', variant: 'destructive' }); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-blog-writer', {
        body: { topic: aiForm.topic, tone: aiForm.tone, keywords: aiForm.keywords, length: aiForm.length }
      });
      if (error) throw error;
      setForm({
        title: data.title || aiForm.topic,
        content: data.content || '',
        excerpt: data.excerpt || '',
        category: data.category || '',
        image_url: '', status: 'draft', author_name: ''
      });
      setAiDialogOpen(false);
      setDialogOpen(true);
      await logActivity('Generated AI blog post', 'blog_post', undefined, { topic: aiForm.topic });
      toast({ title: 'AI blog post generated! Review and save.' });
    } catch (err) {
      console.error('AI generation error:', err);
      toast({ title: 'Failed to generate blog post', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Blog Manager</h3>
          <p className="text-sm text-muted-foreground">Create and manage blog posts</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="cyber"><Sparkles className="w-4 h-4 mr-2" />AI Write</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Generate Blog Post with AI</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="What should the blog be about?" value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={aiForm.tone} onValueChange={v => setAiForm({ ...aiForm, tone: v })}>
                    <SelectTrigger><SelectValue placeholder="Tone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={aiForm.length} onValueChange={v => setAiForm({ ...aiForm, length: v })}>
                    <SelectTrigger><SelectValue placeholder="Length" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (~500 words)</SelectItem>
                      <SelectItem value="medium">Medium (~800 words)</SelectItem>
                      <SelectItem value="long">Long (~1500 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Keywords (comma separated)" value={aiForm.keywords} onChange={e => setAiForm({ ...aiForm, keywords: e.target.value })} />
                <Button className="w-full" onClick={handleAIGenerate} disabled={isGenerating || !aiForm.topic}>
                  {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Blog Post</>}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingPost(null); }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" />New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Post Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Author Name" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Excerpt / Summary" rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                <Textarea placeholder="Full Content (supports markdown)" rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                <Input placeholder="Cover Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                <Button className="w-full" onClick={handleSave} disabled={!form.title}>{editingPost ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <FileText className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{posts.length}</p>
          <p className="text-xs text-muted-foreground">Total Posts</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <Eye className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
          <p className="text-xs text-muted-foreground">Published</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <Edit2 className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
          <p className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
          <p className="text-xs text-muted-foreground">Drafts</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell><Badge variant="outline">{post.category || 'Uncategorized'}</Badge></TableCell>
              <TableCell>{post.author_name || '-'}</TableCell>
              <TableCell>
                <Badge className={post.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No posts yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
