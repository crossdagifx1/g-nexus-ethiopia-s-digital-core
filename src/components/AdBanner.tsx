import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
}

interface AdBannerProps {
  placement: 'hero_banner' | 'in_feed' | 'sidebar';
  className?: string;
}

export const AdBanner = ({ placement, className = '' }: AdBannerProps) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase
        .from('ads' as any)
        .select('*')
        .eq('placement', placement)
        .eq('status', 'active')
        .limit(1);
      if (data && (data as any[]).length > 0) {
        setAd((data as any[])[0]);
        // Track impression
        await (supabase.from('ads' as any) as any)
          .update({ impressions: ((data as any[])[0].impressions || 0) + 1 })
          .eq('id', (data as any[])[0].id);
      }
    };
    fetchAd();
  }, [placement]);

  if (!ad || dismissed) return null;

  const handleClick = async () => {
    await (supabase.from('ads' as any) as any)
      .update({ clicks: (ad as any).clicks + 1 })
      .eq('id', ad.id);
    if (ad.link_url) window.open(ad.link_url, '_blank');
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur ${className}`}>
      <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 z-10 p-1 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-3 h-3" />
      </button>
      <div className="cursor-pointer" onClick={handleClick}>
        {ad.image_url && (
          <img src={ad.image_url} alt={ad.title} className="w-full h-40 object-cover" />
        )}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Sponsored</p>
          <h4 className="font-semibold text-sm text-foreground">{ad.title}</h4>
          {ad.description && <p className="text-xs text-muted-foreground mt-1">{ad.description}</p>}
        </div>
      </div>
    </div>
  );
};
