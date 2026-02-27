import { useState, useEffect } from 'react';
import { PageLayout } from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const fallbackServices = [
  { id: '1', name: "G-Nexus Platform", status: "operational", description: null },
  { id: '2', name: "API Services", status: "operational", description: null },
  { id: '3', name: "Payment Processing", status: "operational", description: null },
  { id: '4', name: "AI Features", status: "operational", description: null },
];

interface ServiceStatus { id: string; name: string; status: string; description: string | null; last_incident?: string | null; }

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase.from('service_status').select('*').order('name');
      if (data && data.length > 0) setServices(data as any);
      setLoading(false);
    };
    fetchStatus();
  }, []);

  const allOperational = services.every(s => s.status === 'operational');
  const statusIcon = (s: string) => {
    if (s === 'operational') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (s === 'degraded') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <PageLayout>
      <PageHero badge="🟢 Status" title="System Status" subtitle="Real-time status of G-Nexus services and infrastructure." />
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <div className={`p-4 rounded-xl ${allOperational ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'} text-center mb-8`}>
              <p className={`font-bold ${allOperational ? 'text-green-400' : 'text-yellow-400'}`}>{allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}</p>
            </div>
          </AnimatedSection>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              {services.map((service, i) => (
                <AnimatedSection key={service.id} delay={i * 100} animation="fadeUp">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{service.name}</span>
                        {service.description && <p className="text-xs text-muted-foreground mt-1">{service.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcon(service.status)}
                        <span className="text-sm capitalize">{service.status}</span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
