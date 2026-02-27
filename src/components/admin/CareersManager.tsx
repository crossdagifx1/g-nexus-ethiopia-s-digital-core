import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Position {
  id: string; title: string; department: string; type: string; location: string | null;
  description: string | null; requirements: any; status: string;
}

export const CareersManager = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', department: '', type: 'Full-time', location: '', description: '', requirements: '', status: 'open' });
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from('career_positions').select('*').order('created_at', { ascending: false });
    setPositions((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', department: '', type: 'Full-time', location: '', description: '', requirements: '', status: 'open' }); setDialogOpen(true); };
  const openEdit = (p: Position) => {
    setEditing(p);
    setForm({ title: p.title, department: p.department, type: p.type, location: p.location || '', description: p.description || '', requirements: JSON.stringify(p.requirements || []), status: p.status });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.department) { toast({ title: 'Title and department required', variant: 'destructive' }); return; }
    let reqs = [];
    try { reqs = JSON.parse(form.requirements || '[]'); } catch { reqs = []; }
    const record = { title: form.title, department: form.department, type: form.type, location: form.location || null, description: form.description || null, requirements: reqs, status: form.status };
    if (editing) {
      const { error } = await supabase.from('career_positions').update(record).eq('id', editing.id);
      if (error) { toast({ title: 'Error', variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('career_positions').insert(record);
      if (error) { toast({ title: 'Error', variant: 'destructive' }); return; }
    }
    toast({ title: editing ? 'Position updated' : 'Position added' });
    setDialogOpen(false); fetch();
  };

  const handleDelete = async (id: string) => { await supabase.from('career_positions').delete().eq('id', id); toast({ title: 'Deleted' }); fetch(); };

  const filtered = positions.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-primary" /><h3 className="font-semibold">Career Positions ({positions.length})</h3></div>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Department</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.department}</TableCell>
              <TableCell>{p.type}</TableCell>
              <TableCell><Badge variant={p.status === 'open' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Position</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><Label>Requirements (JSON array)</Label><Input value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} placeholder='["5+ years React"]' /></div>
            <Button className="w-full" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
