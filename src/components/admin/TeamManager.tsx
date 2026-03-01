import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Users } from 'lucide-react';
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

interface TeamMember {
  id: string; name: string; role: string; bio: string | null; avatar_url: string | null;
  skills: any; social_links: any; fun_fact: string | null; display_order: number; is_active: boolean;
}

export const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', role: '', bio: '', avatar_url: '', fun_fact: '', skills: '', social_links: '', display_order: 0, is_active: true });
  const { toast } = useToast();

  const fetchMembers = async () => {
    const { data } = await supabase.from('team_members').select('*').order('display_order');
    setMembers((data as TeamMember[]) || []); setLoading(false);
  };
  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', role: '', bio: '', avatar_url: '', fun_fact: '', skills: '', social_links: '', display_order: 0, is_active: true }); setDialogOpen(true); };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, bio: m.bio || '', avatar_url: m.avatar_url || '', fun_fact: m.fun_fact || '', skills: JSON.stringify(m.skills || []), social_links: JSON.stringify(m.social_links || {}), display_order: m.display_order, is_active: m.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: 'Name and role required', variant: 'destructive' }); return; }
    let skills = [], social_links = {};
    try { skills = JSON.parse(form.skills || '[]'); } catch { skills = []; }
    try { social_links = JSON.parse(form.social_links || '{}'); } catch { social_links = {}; }
    const record = { name: form.name, role: form.role, bio: form.bio || null, avatar_url: form.avatar_url || null, fun_fact: form.fun_fact || null, skills, social_links, display_order: form.display_order, is_active: form.is_active };
    if (editing) {
      const { error } = await supabase.from('team_members').update(record).eq('id', editing.id);
      if (error) { toast({ title: 'Error updating', variant: 'destructive' }); return; }
      await logActivity('Updated team member', 'team_member', editing.id, { name: form.name });
    } else {
      const { error } = await supabase.from('team_members').insert(record);
      if (error) { toast({ title: 'Error creating', variant: 'destructive' }); return; }
      await logActivity('Added team member', 'team_member', undefined, { name: form.name });
    }
    toast({ title: editing ? 'Member updated' : 'Member added' }); setDialogOpen(false); fetchMembers();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id);
    await logActivity('Deleted team member', 'team_member', id);
    toast({ title: 'Member deleted' }); fetchMembers();
  };

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><h3 className="font-semibold">Team Members ({members.length})</h3></div>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Active</TableHead><TableHead>Order</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(m => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell><TableCell>{m.role}</TableCell>
              <TableCell><Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell>{m.display_order}</TableCell>
              <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Edit2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Team Member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3"><div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div><div><Label>Role</Label><Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} /></div></div>
            <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
            <div><Label>Avatar URL</Label><Input value={form.avatar_url} onChange={e => setForm({...form, avatar_url: e.target.value})} /></div>
            <div><Label>Fun Fact</Label><Input value={form.fun_fact} onChange={e => setForm({...form, fun_fact: e.target.value})} /></div>
            <div><Label>Skills (JSON array)</Label><Input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder='[{"name":"React","level":90}]' /></div>
            <div><Label>Social Links (JSON)</Label><Input value={form.social_links} onChange={e => setForm({...form, social_links: e.target.value})} placeholder='{"linkedin":"#"}' /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div><div className="flex items-center gap-2 pt-6"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>Active</Label></div></div>
            <Button className="w-full" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
