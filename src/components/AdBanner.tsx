import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
}

interface AdBannerProps {
  placement?: 'hero_banner' | 'sidebar' | 'in_feed' | 'popup';
  className?: string;
}

export const AdBanner = ({ placement = 'in_feed', className = "" }: AdBannerProps) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('id, title, description, image_url, link_url, placement')
          .eq('status', 'active')
          .eq('placement', placement)
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setAd(data as Ad);
          // Track impression
          try {
            await (supabase.rpc('increment_ad_impressions' as any, { ad_id: data.id }) as any);
          } catch (e) {
            console.warn('Ad tracking RPC failed (ignoring):', e);
          }
        }
      } catch (err) {
        console.error('Error fetching ad:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [placement]);

  const handleClick = async () => {
    if (ad) {
      await (supabase.rpc('increment_ad_clicks' as any, { ad_id: ad.id }) as any);
    }
  };

  if (loading || !ad) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-muted/30 group ${className}`}
      >
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="text-[10px] py-0 px-1 opacity-50 group-hover:opacity-100 transition-opacity">
            Sponsored
          </Badge>
        </div>

        <a
          href={ad.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block h-full"
        >
          {ad.image_url && (
            <div className="aspect-[16/6] w-full overflow-hidden">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="p-4 bg-gradient-to-t from-background/80 to-transparent">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{ad.title}</h4>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
            </div>
            {ad.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ad.description}</p>
            )}
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper Badge component if ui/badge is not available or to avoid circular deps
const Badge = ({ children, variant, className }: any) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'} ${className}`}>
    {children}
  </span>
);
