import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NavLink { id: string; section: string; label: string; href: string; display_order: number; is_active: boolean; }

export const NavigationManager = () => {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NavLink | null>(null);
  const [filterSection, setFilterSection] = useState('all');
  const [form, setForm] = useState({ section: 'navbar', label: '', href: '', display_order: 0, is_active: true });
  const { toast } = useToast();

  const fetchLinks = async () => {
    const { data } = await supabase.from('navigation_links').select('*').order('display_order');
    setLinks((data as any) || []); setLoading(false);
  };
  useEffect(() => { fetchLinks(); }, []);

  const openAdd = () => { setEditing(null); setForm({ section: 'navbar', label: '', href: '', display_order: 0, is_active: true }); setDialogOpen(true); };
  const openEdit = (l: NavLink) => { setEditing(l); setForm({ section: l.section, label: l.label, href: l.href, display_order: l.display_order, is_active: l.is_active }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.label || !form.href) { toast({ title: 'Label and URL required', variant: 'destructive' }); return; }
    const record = { section: form.section, label: form.label, href: form.href, display_order: form.display_order, is_active: form.is_active };
    if (editing) { await supabase.from('navigation_links').update(record).eq('id', editing.id); }
    else { await supabase.from('navigation_links').insert(record); }
    toast({ title: editing ? 'Link updated' : 'Link added' }); setDialogOpen(false); fetchLinks();
  };

  const handleDelete = async (id: string) => { await supabase.from('navigation_links').delete().eq('id', id); toast({ title: 'Deleted' }); fetchLinks(); };

  const filtered = filterSection === 'all' ? links : links.filter(l => l.section === filterSection);
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Link2 className="w-5 h-5 text-primary" /><h3 className="font-semibold">Navigation Links ({links.length})</h3></div>
        <div className="flex gap-2">
          <Select value={filterSection} onValueChange={setFilterSection}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="navbar">Navbar</SelectItem>
              <SelectItem value="footer_services">Footer Services</SelectItem>
              <SelectItem value="footer_company">Footer Company</SelectItem>
              <SelectItem value="footer_support">Footer Support</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Label</TableHead><TableHead>URL</TableHead><TableHead>Section</TableHead><TableHead>Active</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(l => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.label}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{l.href}</TableCell>
              <TableCell><Badge variant="outline">{l.section}</Badge></TableCell>
              <TableCell><Badge variant={l.is_active ? 'default' : 'secondary'}>{l.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(l.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Link</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Label</Label><Input value={form.label} onChange={e => setForm({...form, label: e.target.value})} /></div>
              <div><Label>URL</Label><Input value={form.href} onChange={e => setForm({...form, href: e.target.value})} placeholder="/page" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Section</Label>
                <Select value={form.section} onValueChange={v => setForm({...form, section: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="navbar">Navbar</SelectItem>
                    <SelectItem value="footer_services">Footer Services</SelectItem>
                    <SelectItem value="footer_company">Footer Company</SelectItem>
                    <SelectItem value="footer_support">Footer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
