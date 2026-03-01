import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Star, Quote } from 'lucide-react';
import { logActivity } from '@/lib/activityLogger';

interface Testimonial {
  id: string; quote: string; author_name: string; author_role: string | null;
  author_company: string | null; avatar_url: string | null; rating: number | null;
  featured: boolean | null; created_at: string;
}

export const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ quote: '', author_name: '', author_role: '', author_company: '', avatar_url: '', rating: 5, featured: false });
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setTestimonials((data as Testimonial[]) || []);
  };

  const handleSave = async () => {
    const payload = { quote: form.quote, author_name: form.author_name, author_role: form.author_role || null, author_company: form.author_company || null, avatar_url: form.avatar_url || null, rating: form.rating, featured: form.featured };
    if (editing) {
      await supabase.from('testimonials').update(payload).eq('id', editing.id);
      await logActivity('Updated testimonial', 'testimonial', editing.id, { author: form.author_name });
      toast({ title: 'Testimonial updated' });
    } else {
      await supabase.from('testimonials').insert([payload]);
      await logActivity('Created testimonial', 'testimonial', undefined, { author: form.author_name });
      toast({ title: 'Testimonial added' });
    }
    setDialogOpen(false); setEditing(null);
    setForm({ quote: '', author_name: '', author_role: '', author_company: '', avatar_url: '', rating: 5, featured: false });
    fetchData();
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ quote: t.quote, author_name: t.author_name, author_role: t.author_role || '', author_company: t.author_company || '', avatar_url: t.avatar_url || '', rating: t.rating || 5, featured: t.featured || false });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    await logActivity('Deleted testimonial', 'testimonial', id);
    toast({ title: 'Testimonial deleted' }); fetchData();
  };

  const toggleFeatured = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ featured: !t.featured }).eq('id', t.id);
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">Testimonials</h3><p className="text-sm text-muted-foreground">Manage customer testimonials</p></div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Textarea placeholder="Quote" rows={3} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} />
              <Input placeholder="Author Name" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Role / Title" value={form.author_role} onChange={e => setForm({ ...form, author_role: e.target.value })} />
                <Input placeholder="Company" value={form.author_company} onChange={e => setForm({ ...form, author_company: e.target.value })} />
              </div>
              <Input placeholder="Avatar URL" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setForm({ ...form, rating: n })} className="focus:outline-none">
                      <Star className={`w-5 h-5 ${n <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />Featured
                </label>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={!form.quote || !form.author_name}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className={`p-5 rounded-2xl border ${t.featured ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
            <div className="flex items-start justify-between mb-3">
              <Quote className="w-6 h-6 text-primary/30" />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggleFeatured(t)}><Star className={`w-4 h-4 ${t.featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <p className="text-foreground mb-4 italic">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              {t.avatar_url ? <img src={t.avatar_url} alt={t.author_name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.author_name[0]}</div>}
              <div><p className="font-medium text-sm">{t.author_name}</p><p className="text-xs text-muted-foreground">{[t.author_role, t.author_company].filter(Boolean).join(' · ')}</p></div>
            </div>
            <div className="flex mt-3">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}</div>
          </div>
        ))}
        {testimonials.length === 0 && <div className="col-span-2 text-center py-12 text-muted-foreground"><Quote className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No testimonials yet</p></div>}
      </div>
    </div>
  );
};
