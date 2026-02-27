import { useState, useEffect } from 'react';
import { Loader2, Ticket, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string; name: string; email: string; subject: string | null;
  message: string; priority: string; status: string; created_at: string;
}

export const SupportManager = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewing, setViewing] = useState<SupportTicket | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    setTickets((data as any) || []); setLoading(false);
  };
  useEffect(() => { fetchTickets(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('support_tickets').update({ status }).eq('id', id);
    toast({ title: `Ticket ${status}` }); fetchTickets();
  };

  const filtered = tickets.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()) || (t.subject || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const statusColor = (s: string) => s === 'open' ? 'default' : s === 'in_progress' ? 'secondary' : 'outline';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Ticket className="w-5 h-5 text-primary" /><h3 className="font-semibold">Support Tickets ({tickets.length})</h3></div>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem><SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Time</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filtered.map(t => (
            <TableRow key={t.id}>
              <TableCell><div className="font-medium">{t.name}</div><div className="text-xs text-muted-foreground">{t.email}</div></TableCell>
              <TableCell className="max-w-xs truncate">{t.subject || 'No subject'}</TableCell>
              <TableCell><Badge variant={t.priority === 'urgent' ? 'destructive' : 'outline'}>{t.priority}</Badge></TableCell>
              <TableCell><Badge variant={statusColor(t.status)}>{t.status}</Badge></TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setViewing(t)}><Eye className="w-4 h-4" /></Button>
                  {t.status === 'open' && <Button variant="ghost" size="sm" onClick={() => updateStatus(t.id, 'in_progress')}>Start</Button>}
                  {t.status !== 'resolved' && <Button variant="ghost" size="sm" onClick={() => updateStatus(t.id, 'resolved')}>Resolve</Button>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ticket: {viewing?.subject || 'No subject'}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3">
              <div><strong>From:</strong> {viewing.name} ({viewing.email})</div>
              <div><strong>Priority:</strong> <Badge variant={viewing.priority === 'urgent' ? 'destructive' : 'outline'}>{viewing.priority}</Badge></div>
              <div><strong>Status:</strong> <Badge>{viewing.status}</Badge></div>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">{viewing.message}</div>
              <div className="flex gap-2">
                {viewing.status !== 'resolved' && <Button onClick={() => { updateStatus(viewing.id, 'resolved'); setViewing(null); }}>Resolve</Button>}
                {viewing.status === 'open' && <Button variant="outline" onClick={() => { updateStatus(viewing.id, 'in_progress'); setViewing(null); }}>In Progress</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
