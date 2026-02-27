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
import { Plus, Edit2, Trash2, Eye, Pause, Play, BarChart3, MousePointer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  impressions: number | null;
  clicks: number | null;
  created_at: string;
}

export const AdManager = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', link_url: '', placement: 'in_feed', status: 'active', start_date: '', end_date: '' });
  const { toast } = useToast();

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    const { data } = await supabase.from('ads' as any).select('*').order('created_at', { ascending: false });
    setAds((data as any[]) || []);
  };

  const handleSave = async () => {
    const payload = { ...form, description: form.description || null, image_url: form.image_url || null, link_url: form.link_url || null, start_date: form.start_date || null, end_date: form.end_date || null };
    
    if (editingAd) {
      await (supabase.from('ads' as any) as any).update(payload).eq('id', editingAd.id);
      toast({ title: 'Ad updated' });
    } else {
      await (supabase.from('ads' as any) as any).insert(payload);
      toast({ title: 'Ad created' });
    }
    setDialogOpen(false);
    setEditingAd(null);
    setForm({ title: '', description: '', image_url: '', link_url: '', placement: 'in_feed', status: 'active', start_date: '', end_date: '' });
    fetchAds();
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setForm({ title: ad.title, description: ad.description || '', image_url: ad.image_url || '', link_url: ad.link_url || '', placement: ad.placement, status: ad.status, start_date: ad.start_date?.slice(0, 10) || '', end_date: ad.end_date?.slice(0, 10) || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await (supabase.from('ads' as any) as any).delete().eq('id', id);
    toast({ title: 'Ad deleted' });
    fetchAds();
  };

  const toggleStatus = async (ad: Ad) => {
    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    await (supabase.from('ads' as any) as any).update({ status: newStatus }).eq('id', ad.id);
    fetchAds();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'paused': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ad Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage advertisements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingAd(null); setForm({ title: '', description: '', image_url: '', link_url: '', placement: 'in_feed', status: 'active', start_date: '', end_date: '' }); } }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />New Ad</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingAd ? 'Edit Ad' : 'Create Ad'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Ad Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              <Input placeholder="Link URL" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Select value={form.placement} onValueChange={v => setForm({ ...form, placement: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero_banner">Hero Banner</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="in_feed">In Feed</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Start Date</label>
                  <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End Date</label>
                  <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={!form.title}>{editingAd ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <BarChart3 className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{ads.reduce((a, b) => a + (b.impressions || 0), 0)}</p>
          <p className="text-xs text-muted-foreground">Total Impressions</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <MousePointer className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{ads.reduce((a, b) => a + (b.clicks || 0), 0)}</p>
          <p className="text-xs text-muted-foreground">Total Clicks</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <Eye className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold">{ads.filter(a => a.status === 'active').length}</p>
          <p className="text-xs text-muted-foreground">Active Ads</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Placement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map(ad => {
            const ctr = ad.impressions ? ((ad.clicks || 0) / ad.impressions * 100).toFixed(1) : '0.0';
            return (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell><Badge variant="outline">{ad.placement}</Badge></TableCell>
                <TableCell><Badge className={statusColor(ad.status)}>{ad.status}</Badge></TableCell>
                <TableCell>{ad.impressions || 0}</TableCell>
                <TableCell>{ad.clicks || 0}</TableCell>
                <TableCell>{ctr}%</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(ad)}>
                      {ad.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ad.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {ads.length === 0 && (
            <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No ads yet. Create your first ad.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
