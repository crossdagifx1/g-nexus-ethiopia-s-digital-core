import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Users, X, Link as LinkIcon, Linkedin, Twitter, Github, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity } from '@/lib/activityLogger';

interface Skill { name: string; level: number; }
interface SocialLinks { linkedin?: string; twitter?: string; github?: string; website?: string; }

interface TeamMember {
  id: string; name: string; role: string; bio: string | null; avatar_url: string | null;
  skills: Skill[]; social_links: SocialLinks; fun_fact: string | null; display_order: number; is_active: boolean;
}

export const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', role: '', bio: '', avatar_url: '', fun_fact: '',
    skills: [] as Skill[], social_links: {} as SocialLinks,
    display_order: 0, is_active: true
  });
  const { toast } = useToast();

  const fetchMembers = async () => {
    const { data } = await supabase.from('team_members').select('*').order('display_order');
    setMembers((data as any) || []); setLoading(false);
  };
  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', role: '', bio: '', avatar_url: '', fun_fact: '', skills: [], social_links: {}, display_order: 0, is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name, role: m.role, bio: m.bio || '', avatar_url: m.avatar_url || '',
      fun_fact: m.fun_fact || '',
      skills: Array.isArray(m.skills) ? m.skills : [],
      social_links: m.social_links || {},
      display_order: m.display_order, is_active: m.is_active
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: 'Name and role required', variant: 'destructive' }); return; }
    const record = {
      name: form.name, role: form.role, bio: form.bio || null,
      avatar_url: form.avatar_url || null, fun_fact: form.fun_fact || null,
      skills: form.skills as any, social_links: form.social_links as any,
      display_order: form.display_order, is_active: form.is_active
    };

    if (editing) {
      const { error } = await supabase.from('team_members').update(record as any).eq('id', editing.id);
      if (error) { toast({ title: 'Error updating', variant: 'destructive' }); return; }
      await logActivity('Updated team member', 'team_member', editing.id, { name: form.name });
    } else {
      const { error } = await supabase.from('team_members').insert([record as any]);
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

  const addSkill = () => setForm({ ...form, skills: [...form.skills, { name: '', level: 80 }] });
  const removeSkill = (index: number) => setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const newSkills = [...form.skills];
    (newSkills[index] as any)[field] = value;
    setForm({ ...form, skills: newSkills });
  };

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setForm({ ...form, social_links: { ...form.social_links, [key]: value } });
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
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Active</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(m => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell><TableCell>{m.role}</TableCell>
                <TableCell><Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell>{m.display_order}</TableCell>
                <TableCell className="text-right"><div className="flex gap-1 justify-end"><Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Edit2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No members found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Team Member</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Lead Designer" /></div>
            </div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short professional bio..." /></div>
            <div className="space-y-2"><Label>Avatar URL</Label><Input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." /></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between"><Label className="text-primary">Skills</Label><Button variant="outline" size="sm" onClick={addSkill} className="h-7 px-2"><Plus className="w-3 h-3 mr-1" />Add Skill</Button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.skills.map((skill, i) => (
                  <div key={i} className="flex gap-2 items-center bg-muted/30 p-2 rounded-lg border border-border/50">
                    <Input className="h-8" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} placeholder="React" />
                    <Input className="h-8 w-20" type="number" value={skill.level} onChange={e => updateSkill(i, 'level', parseInt(e.target.value))} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSkill(i)}><X className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-primary">Social Links</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative"><Linkedin className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input className="pl-9 h-9" value={form.social_links.linkedin || ''} onChange={e => updateSocial('linkedin', e.target.value)} placeholder="LinkedIn URL" /></div>
                <div className="relative"><Twitter className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input className="pl-9 h-9" value={form.social_links.twitter || ''} onChange={e => updateSocial('twitter', e.target.value)} placeholder="Twitter URL" /></div>
                <div className="relative"><Github className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input className="pl-9 h-9" value={form.social_links.github || ''} onChange={e => updateSocial('github', e.target.value)} placeholder="GitHub URL" /></div>
                <div className="relative"><LinkIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" /><Input className="pl-9 h-9" value={form.social_links.website || ''} onChange={e => updateSocial('website', e.target.value)} placeholder="Portfolio URL" /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="space-y-2"><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-3 p-2 border border-border/50 rounded-lg">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} id="is-active" />
                <Label htmlFor="is-active" className="cursor-pointer">Active Profile</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update Member' : 'Create Member'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
