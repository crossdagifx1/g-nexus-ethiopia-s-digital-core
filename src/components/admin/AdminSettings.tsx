import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Bell, Building2, Save, Loader2, Plus, X, Facebook, Twitter, Linkedin, Instagram, AlertTriangle, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity } from '@/lib/activityLogger';

interface ChatSettings {
  agent_name: string; greeting_message: string; business_hours_start: string;
  business_hours_end: string; auto_response_enabled: boolean; quick_replies: string[];
}
interface NotificationSettings { email_notifications: boolean; sound_enabled: boolean; new_chat_alert: boolean; }
interface CompanySettings { name: string; email: string; phone: string; social_links: { facebook: string; twitter: string; linkedin: string; instagram: string; }; }
interface SEOSettings { site_title: string; site_description: string; og_image_url: string; }
interface HeroSettings { agent_label: string; agent_link: string; nexus_label: string; nexus_link: string; }

export const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({ agent_name: 'Tsion', greeting_message: '', business_hours_start: '09:00', business_hours_end: '18:00', auto_response_enabled: false, quick_replies: [] });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ email_notifications: true, sound_enabled: true, new_chat_alert: true });
  const [companySettings, setCompanySettings] = useState<CompanySettings>({ name: 'G-Nexus', email: '', phone: '', social_links: { facebook: '', twitter: '', linkedin: '', instagram: '' } });
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({ site_title: '', site_description: '', og_image_url: '' });
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({ agent_label: 'AI Agent', agent_link: '/chat', nexus_label: 'G-Nexus AI', nexus_link: '/platform' });
  const [newQuickReply, setNewQuickReply] = useState('');
  const [aiTestPrompt, setAiTestPrompt] = useState('');
  const [aiTestResult, setAiTestResult] = useState('');
  const [isTestingAI, setIsTestingAI] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('admin_settings').select('*');
      if (data) {
        data.forEach(s => {
          if (s.key === 'chat_settings') setChatSettings(s.value as unknown as ChatSettings);
          else if (s.key === 'notification_settings') setNotificationSettings(s.value as unknown as NotificationSettings);
          else if (s.key === 'company_settings') setCompanySettings(s.value as unknown as CompanySettings);
          else if (s.key === 'seo_settings') setSeoSettings(s.value as unknown as SEOSettings);
          else if (s.key === 'hero_settings') setHeroSettings(s.value as unknown as HeroSettings);
        });
      }
    } catch (error) { console.error('Error fetching settings:', error); }
    finally { setIsLoading(false); }
  };

  const saveSettings = async (key: string, value: unknown) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('admin_settings').update({ value: value as any, updated_at: new Date().toISOString() }).eq('key', key);
      if (error) {
        // If no row exists, insert
        await supabase.from('admin_settings').insert([{ key, value: value as any }]);
      }
      await logActivity(`Updated ${key}`, 'admin_settings', key);
      toast({ title: 'Settings saved successfully' });
    } catch { toast({ title: 'Failed to save settings', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  const handleTestAI = async () => {
    if (!aiTestPrompt) return;
    setIsTestingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: aiTestPrompt, sessionId: 'admin-test' }
      });
      if (error) throw error;
      setAiTestResult(data.response || 'No response');
    } catch { setAiTestResult('Error: Could not reach AI'); }
    finally { setIsTestingAI(false); }
  };

  const handleClearChatHistory = async () => {
    try {
      await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('chat_conversations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await logActivity('Cleared all chat history', 'system');
      toast({ title: 'Chat history cleared' });
    } catch { toast({ title: 'Failed to clear history', variant: 'destructive' }); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h3 className="text-lg font-semibold">Settings</h3><p className="text-sm text-muted-foreground">Configure your admin panel and site settings</p></div>
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat" className="gap-2"><Bot className="w-4 h-4" />Chat</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Alerts</TabsTrigger>
          <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" />Company</TabsTrigger>
          <TabsTrigger value="hero" className="gap-2"><Sparkles className="w-4 h-4" />Hero</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" />AI</TabsTrigger>
          <TabsTrigger value="danger" className="gap-2"><AlertTriangle className="w-4 h-4" />Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card><CardHeader><CardTitle>Chat Widget Configuration</CardTitle><CardDescription>Customize how your AI chat assistant behaves</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>AI Agent Name</Label><Input value={chatSettings.agent_name} onChange={e => setChatSettings({ ...chatSettings, agent_name: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Hours Start</Label><Input type="time" value={chatSettings.business_hours_start} onChange={e => setChatSettings({ ...chatSettings, business_hours_start: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Hours End</Label><Input type="time" value={chatSettings.business_hours_end} onChange={e => setChatSettings({ ...chatSettings, business_hours_end: e.target.value })} /></div>
                  </div>
                </div>
                <div className="space-y-2"><Label>Greeting Message</Label><Textarea value={chatSettings.greeting_message} onChange={e => setChatSettings({ ...chatSettings, greeting_message: e.target.value })} placeholder="Hi! I am Tsion..." rows={3} /></div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"><div><p className="font-medium">Auto-response for Off-hours</p><p className="text-sm text-muted-foreground">Automatically respond outside business hours</p></div><Switch checked={chatSettings.auto_response_enabled} onCheckedChange={c => setChatSettings({ ...chatSettings, auto_response_enabled: c })} /></div>
                <div className="space-y-3"><Label>Quick Reply Suggestions</Label>
                  <div className="flex flex-wrap gap-2">{chatSettings.quick_replies.map((r, i) => <Badge key={i} variant="secondary" className="gap-1 py-1.5 px-3">{r}<button onClick={() => setChatSettings({ ...chatSettings, quick_replies: chatSettings.quick_replies.filter((_, idx) => idx !== i) })}><X className="w-3 h-3" /></button></Badge>)}</div>
                  <div className="flex gap-2"><Input placeholder="Add a quick reply..." value={newQuickReply} onChange={e => setNewQuickReply(e.target.value)} onKeyPress={e => { if (e.key === 'Enter' && newQuickReply.trim()) { setChatSettings({ ...chatSettings, quick_replies: [...chatSettings.quick_replies, newQuickReply.trim()] }); setNewQuickReply(''); } }} /><Button variant="outline" onClick={() => { if (newQuickReply.trim()) { setChatSettings({ ...chatSettings, quick_replies: [...chatSettings.quick_replies, newQuickReply.trim()] }); setNewQuickReply(''); } }}><Plus className="w-4 h-4" /></Button></div>
                </div>
                <Button onClick={() => saveSettings('chat_settings', chatSettings)} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Chat Settings</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card><CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive email alerts for new chats', key: 'email_notifications' as const },
                  { label: 'Sound Alerts', desc: 'Play sound when new messages arrive', key: 'sound_enabled' as const },
                  { label: 'New Chat Alert', desc: 'Show badge when new conversations start', key: 'new_chat_alert' as const },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={notificationSettings[item.key]} onCheckedChange={c => setNotificationSettings({ ...notificationSettings, [item.key]: c })} />
                  </div>
                ))}
                <Button onClick={() => saveSettings('notification_settings', notificationSettings)} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="company">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card><CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Company Name</Label><Input value={companySettings.name} onChange={e => setCompanySettings({ ...companySettings, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={companySettings.email} onChange={e => setCompanySettings({ ...companySettings, email: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Phone</Label><Input value={companySettings.phone} onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })} /></div>
                <div className="space-y-4"><Label>Social Media Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[{ icon: Facebook, key: 'facebook', color: 'text-blue-600' }, { icon: Twitter, key: 'twitter', color: 'text-sky-500' }, { icon: Linkedin, key: 'linkedin', color: 'text-blue-700' }, { icon: Instagram, key: 'instagram', color: 'text-pink-500' }].map(s => (
                      <div key={s.key} className="flex items-center gap-2"><s.icon className={`w-5 h-5 ${s.color}`} /><Input placeholder={`${s.key} URL`} value={(companySettings.social_links as any)[s.key]} onChange={e => setCompanySettings({ ...companySettings, social_links: { ...companySettings.social_links, [s.key]: e.target.value } })} /></div>
                    ))}
                  </div>
                </div>
                <Button onClick={() => saveSettings('company_settings', companySettings)} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />SEO & Meta Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Site Title</Label><Input value={seoSettings.site_title} onChange={e => setSeoSettings({ ...seoSettings, site_title: e.target.value })} placeholder="G-Nexus - Digital Agency" /></div>
                <div className="space-y-2"><Label>Meta Description</Label><Textarea value={seoSettings.site_description} onChange={e => setSeoSettings({ ...seoSettings, site_description: e.target.value })} placeholder="Your site description for search engines..." rows={2} /></div>
                <div className="space-y-2"><Label>OG Image URL</Label><Input value={seoSettings.og_image_url} onChange={e => setSeoSettings({ ...seoSettings, og_image_url: e.target.value })} placeholder="https://..." /></div>
                <Button onClick={() => saveSettings('seo_settings', seoSettings)} disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save SEO Settings</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="hero">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-gold" />Hero Buttons Configuration</CardTitle>
                <CardDescription>Customize the labels and links for your primary call-to-action buttons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-4">
                    <Badge variant="outline" className="text-gold border-gold/30">Primary: AI Agent</Badge>
                    <div className="space-y-2"><Label>Button Label</Label><Input value={heroSettings.agent_label} onChange={e => setHeroSettings({ ...heroSettings, agent_label: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Button Link</Label><Input value={heroSettings.agent_link} onChange={e => setHeroSettings({ ...heroSettings, agent_link: e.target.value })} placeholder="/chat or https://..." /></div>
                  </div>
                  <div className="space-y-4">
                    <Badge variant="outline" className="text-cyan border-cyan/30">Secondary: G-Nexus AI</Badge>
                    <div className="space-y-2"><Label>Button Label</Label><Input value={heroSettings.nexus_label} onChange={e => setHeroSettings({ ...heroSettings, nexus_label: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Button Link</Label><Input value={heroSettings.nexus_link} onChange={e => setHeroSettings({ ...heroSettings, nexus_link: e.target.value })} placeholder="/platform or https://..." /></div>
                  </div>
                </div>
                <Button onClick={() => saveSettings('hero_settings', heroSettings)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Hero Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ai">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card><CardHeader><CardTitle>AI Configuration</CardTitle><CardDescription>Test and configure AI behavior</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                  <p className="font-medium">AI Model</p>
                  <p className="text-sm text-muted-foreground">Primary: arcee-ai/trinity-large-preview:free</p>
                  <p className="text-sm text-muted-foreground">Fallback: arcee-ai/trinity-mini:free</p>
                  <Badge variant="outline">OpenRouter API</Badge>
                </div>
                <div className="space-y-3">
                  <Label>Test AI Response</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Type a test message..." value={aiTestPrompt} onChange={e => setAiTestPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleTestAI()} />
                    <Button onClick={handleTestAI} disabled={isTestingAI || !aiTestPrompt}>
                      {isTestingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </Button>
                  </div>
                  {aiTestResult && <div className="p-4 bg-muted rounded-xl text-sm whitespace-pre-wrap">{aiTestResult}</div>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="danger">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-destructive/50"><CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5" />Danger Zone</CardTitle><CardDescription>Irreversible actions. Proceed with caution.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-xl">
                  <div><p className="font-medium">Clear All Chat History</p><p className="text-sm text-muted-foreground">Permanently delete all conversations and messages</p></div>
                  <Button variant="destructive" size="sm" onClick={handleClearChatHistory}>Clear All</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
