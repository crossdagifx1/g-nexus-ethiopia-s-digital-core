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
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: '', image_url: '', status: 'draft', author_name: '' });
  const { toast } = useToast();

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts' as any).select('*').order('created_at', { ascending: false });
    setPosts((data as any[]) || []);
  };

  const handleSave = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const payload: any = {
      title: form.title,
      content: form.content || null,
      excerpt: form.excerpt || null,
      category: form.category || null,
      image_url: form.image_url || null,
      status: form.status,
      author_name: form.author_name || user?.email || null,
      author_id: user?.id,
    };
    if (form.status === 'published' && !editingPost?.published_at) {
      payload.published_at = new Date().toISOString();
    }

    if (editingPost) {
      await (supabase.from('blog_posts' as any) as any).update(payload).eq('id', editingPost.id);
      toast({ title: 'Post updated' });
    } else {
      await (supabase.from('blog_posts' as any) as any).insert(payload);
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
    await (supabase.from('blog_posts' as any) as any).delete().eq('id', id);
    toast({ title: 'Post deleted' });
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Blog Manager</h3>
          <p className="text-sm text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingPost(null); } }}>
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
