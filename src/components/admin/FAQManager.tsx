import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, HelpCircle } from 'lucide-react';
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
import { logActivity } from '@/lib/activityLogger';

interface FAQItem { id: string; question: string; answer: string; category: string; display_order: number; is_active: boolean; }

export const FAQManager = () => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', display_order: 0, is_active: true });
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from('faq_items').select('*').order('display_order');
    setItems((data as FAQItem[]) || []); setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm({ question: '', answer: '', category: 'General', display_order: 0, is_active: true }); setDialogOpen(true); };
  const openEdit = (f: FAQItem) => { setEditing(f); setForm({ question: f.question, answer: f.answer, category: f.category, display_order: f.display_order, is_active: f.is_active }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast({ title: 'Question and answer required', variant: 'destructive' }); return; }
    const record = { question: form.question, answer: form.answer, category: form.category, display_order: form.display_order, is_active: form.is_active };
    if (editing) {
      await supabase.from('faq_items').update(record).eq('id', editing.id);
      await logActivity('Updated FAQ', 'faq_item', editing.id, { question: form.question.slice(0, 50) });
    } else {
      await supabase.from('faq_items').insert(record);
      await logActivity('Created FAQ', 'faq_item', undefined, { question: form.question.slice(0, 50) });
    }
    toast({ title: editing ? 'FAQ updated' : 'FAQ added' }); setDialogOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('faq_items').delete().eq('id', id);
    await logActivity('Deleted FAQ', 'faq_item', id);
    toast({ title: 'Deleted' }); fetchItems();
  };

  const filtered = items.filter(i => i.question.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-primary" /><h3 className="font-semibold">FAQ Items ({items.length})</h3></div>
        <div className="flex gap-2"><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" /><Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Category</TableHead><TableHead>Active</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-xs truncate">{item.question}</TableCell>
              <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
              <TableCell><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} FAQ</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Question</Label><Input value={form.question} onChange={e => setForm({...form, question: e.target.value})} /></div>
            <div><Label>Answer</Label><Textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows={4} /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Category</Label><Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div><div><Label>Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>Active</Label></div>
            <Button className="w-full" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
