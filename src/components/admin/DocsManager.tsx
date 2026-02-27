import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocEntry { id: string; title: string; description: string | null; content: string | null; category: string; icon: string; display_order: number; is_active: boolean; }

export const DocsManager = () => {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DocEntry | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', content: '', category: 'General', icon: 'Book', display_order: 0, is_active: true });
  const { toast } = useToast();

  const fetchDocs = async () => {
    const { data } = await supabase.from('documentation_entries').select('*').order('display_order');
    setDocs((data as any) || []); setLoading(false);
  };
  useEffect(() => { fetchDocs(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', content: '', category: 'General', icon: 'Book', display_order: 0, is_active: true }); setDialogOpen(true); };
  const openEdit = (d: DocEntry) => { setEditing(d); setForm({ title: d.title, description: d.description || '', content: d.content || '', category: d.category, icon: d.icon, display_order: d.display_order, is_active: d.is_active }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    const record = { title: form.title, description: form.description || null, content: form.content || null, category: form.category, icon: form.icon, display_order: form.display_order, is_active: form.is_active };
    if (editing) { await supabase.from('documentation_entries').update(record).eq('id', editing.id); }
    else { await supabase.from('documentation_entries').insert(record); }
    toast({ title: editing ? 'Doc updated' : 'Doc added' }); setDialogOpen(false); fetchDocs();
  };

  const handleDelete = async (id: string) => { await supabase.from('documentation_entries').delete().eq('id', id); toast({ title: 'Deleted' }); fetchDocs(); };

  const filtered = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-primary" /><h3 className="font-semibold">Documentation ({docs.length})</h3></div>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Active</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(d => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell><Badge variant="outline">{d.category}</Badge></TableCell>
              <TableCell><Badge variant={d.is_active ? 'default' : 'secondary'}>{d.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Documentation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
              <div><Label>Icon</Label><Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} /></div>
              <div><Label>Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>Active</Label></div>
            <Button className="w-full" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
