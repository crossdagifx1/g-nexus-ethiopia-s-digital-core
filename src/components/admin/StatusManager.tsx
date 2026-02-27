import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatus { id: string; name: string; status: string; description: string | null; last_incident: string | null; }

export const StatusManager = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceStatus | null>(null);
  const [form, setForm] = useState({ name: '', status: 'operational', description: '', last_incident: '' });
  const { toast } = useToast();

  const fetchServices = async () => {
    const { data } = await supabase.from('service_status').select('*').order('name');
    setServices((data as any) || []); setLoading(false);
  };
  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', status: 'operational', description: '', last_incident: '' }); setDialogOpen(true); };
  const openEdit = (s: ServiceStatus) => { setEditing(s); setForm({ name: s.name, status: s.status, description: s.description || '', last_incident: s.last_incident || '' }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'Name required', variant: 'destructive' }); return; }
    const record = { name: form.name, status: form.status, description: form.description || null, last_incident: form.last_incident || null };
    if (editing) { await supabase.from('service_status').update(record).eq('id', editing.id); }
    else { await supabase.from('service_status').insert(record); }
    toast({ title: editing ? 'Service updated' : 'Service added' }); setDialogOpen(false); fetchServices();
  };

  const handleDelete = async (id: string) => { await supabase.from('service_status').delete().eq('id', id); toast({ title: 'Deleted' }); fetchServices(); };

  const statusColor = (s: string) => s === 'operational' ? 'text-green-500' : s === 'degraded' ? 'text-yellow-500' : 'text-red-500';

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Activity className="w-5 h-5 text-primary" /><h3 className="font-semibold">Service Status ({services.length})</h3></div>
        <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>Status</TableHead><TableHead>Description</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {services.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell><span className={`font-medium capitalize ${statusColor(s.status)}`}>{s.status}</span></TableCell>
              <TableCell className="text-muted-foreground text-sm">{s.description || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Service Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="outage">Outage</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><Label>Last Incident</Label><Input value={form.last_incident} onChange={e => setForm({...form, last_incident: e.target.value})} /></div>
            <Button className="w-full" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
