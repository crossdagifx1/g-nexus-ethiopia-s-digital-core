import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Users, Star, BarChart3, Activity, RefreshCw, FileText, Ticket, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalConversations: number; todayConversations: number; weekConversations: number;
  avgResponseTime: number; avgMessagesPerConversation: number; satisfactionScore: number;
  resolvedRate: number; activeConversations: number;
  conversationsByDay: { date: string; count: number }[];
  hourlyActivity: { hour: string; count: number }[];
  statusDistribution: { name: string; value: number }[];
  // Content stats
  totalBlogPosts: number; totalTestimonials: number; totalTeamMembers: number;
  openTickets: number; totalFAQ: number; totalPortfolio: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))', 'hsl(142 76% 36%)', 'hsl(var(--destructive))'];

export const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const [convRes, msgRes, ratingRes, blogRes, testRes, teamRes, ticketRes, faqRes, portfolioRes] = await Promise.all([
        supabase.from('chat_conversations').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_messages').select('conversation_id, created_at, role'),
        supabase.from('chat_ratings').select('rating'),
        supabase.from('blog_posts').select('id, created_at', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('support_tickets').select('id, status'),
        supabase.from('faq_items').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
      ]);

      const convList = convRes.data || [];
      const msgList = msgRes.data || [];
      const ratingList = ratingRes.data || [];
      const openTickets = (ticketRes.data || []).filter(t => t.status === 'open').length;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 86400000);

      const todayConversations = convList.filter(c => new Date(c.created_at) >= today).length;
      const weekConversations = convList.filter(c => new Date(c.created_at) >= weekAgo).length;
      const activeConversations = convList.filter(c => c.status === 'active').length;
      const resolvedConversations = convList.filter(c => c.resolved_at).length;

      // Avg messages per conversation
      const countByConv: Record<string, number> = {};
      msgList.forEach(m => { countByConv[m.conversation_id] = (countByConv[m.conversation_id] || 0) + 1; });
      const avgMessages = Object.keys(countByConv).length > 0
        ? Object.values(countByConv).reduce((a, b) => a + b, 0) / Object.keys(countByConv).length : 0;

      // Calculate actual avg response time from message timestamps
      let totalResponseTime = 0, responseCount = 0;
      const msgsByConv: Record<string, { role: string; created_at: string }[]> = {};
      msgList.forEach(m => {
        if (!msgsByConv[m.conversation_id]) msgsByConv[m.conversation_id] = [];
        msgsByConv[m.conversation_id].push(m);
      });
      Object.values(msgsByConv).forEach(msgs => {
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        for (let i = 1; i < msgs.length; i++) {
          if (msgs[i].role === 'assistant' && msgs[i - 1].role === 'user') {
            totalResponseTime += new Date(msgs[i].created_at).getTime() - new Date(msgs[i - 1].created_at).getTime();
            responseCount++;
          }
        }
      });
      const avgResponseTime = responseCount > 0 ? Math.round(totalResponseTime / responseCount / 1000 * 10) / 10 : 0;

      const avgRating = ratingList.length > 0 ? ratingList.reduce((a, b) => a + b.rating, 0) / ratingList.length : 0;

      // Daily data
      const dayData: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 86400000);
        dayData[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
      }
      convList.forEach(c => {
        const cDate = new Date(c.created_at);
        if (cDate >= weekAgo) {
          const key = cDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (dayData[key] !== undefined) dayData[key]++;
        }
      });

      // Hourly
      const hourData: Record<string, number> = {};
      for (let i = 0; i < 24; i++) hourData[`${i.toString().padStart(2, '0')}:00`] = 0;
      convList.forEach(c => { const h = new Date(c.created_at).getHours(); hourData[`${h.toString().padStart(2, '0')}:00`]++; });

      // Status distribution
      const statusCounts: Record<string, number> = { active: 0, closed: 0, resolved: 0 };
      convList.forEach(c => {
        const status = c.resolved_at ? 'resolved' : (c.status || 'active');
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      setData({
        totalConversations: convList.length, todayConversations, weekConversations, avgResponseTime,
        avgMessagesPerConversation: Math.round(avgMessages * 10) / 10,
        satisfactionScore: Math.round(avgRating * 10) / 10,
        resolvedRate: convList.length > 0 ? Math.round((resolvedConversations / convList.length) * 100) : 0,
        activeConversations,
        conversationsByDay: Object.entries(dayData).map(([date, count]) => ({ date, count })),
        hourlyActivity: Object.entries(hourData).map(([hour, count]) => ({ hour, count })),
        statusDistribution: Object.entries(statusCounts).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value })),
        totalBlogPosts: blogRes.count || 0, totalTestimonials: testRes.count || 0,
        totalTeamMembers: teamRes.count || 0, openTickets, totalFAQ: faqRes.count || 0,
        totalPortfolio: portfolioRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false); setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">Analytics Dashboard</h3><p className="text-sm text-muted-foreground">Real-time insights across all content</p></div>
        <Button variant="outline" size="sm" onClick={() => { setIsRefreshing(true); fetchAnalytics(); }} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      {/* Content KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: FileText, label: 'Blog Posts', value: data.totalBlogPosts, color: 'text-primary bg-primary/10' },
          { icon: Quote, label: 'Testimonials', value: data.totalTestimonials, color: 'text-purple-500 bg-purple-500/10' },
          { icon: Users, label: 'Team', value: data.totalTeamMembers, color: 'text-blue-500 bg-blue-500/10' },
          { icon: Ticket, label: 'Open Tickets', value: data.openTickets, color: 'text-red-500 bg-red-500/10' },
          { icon: Activity, label: 'FAQ Items', value: data.totalFAQ, color: 'text-green-500 bg-green-500/10' },
          { icon: BarChart3, label: 'Portfolio', value: data.totalPortfolio, color: 'text-yellow-500 bg-yellow-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card><CardContent className="p-3 text-center">
              <div className={`p-2 rounded-lg ${s.color} w-fit mx-auto mb-1`}><s.icon className="w-4 h-4" /></div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      {/* Chat metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: "Today's Chats", value: data.todayConversations, sub: data.todayConversations > 0 ? 'Active today' : 'No chats yet', color: 'bg-primary/10 text-primary' },
          { icon: BarChart3, label: 'This Week', value: data.weekConversations, sub: 'Last 7 days', color: 'bg-blue-500/10 text-blue-500' },
          { icon: Activity, label: 'Avg Messages', value: data.avgMessagesPerConversation, sub: 'Per conversation', color: 'bg-purple-500/10 text-purple-500' },
          { icon: Star, label: 'Satisfaction', value: data.satisfactionScore > 0 ? `${data.satisfactionScore}/5` : 'N/A', sub: data.satisfactionScore >= 4 ? 'Excellent' : data.satisfactionScore >= 3 ? 'Good' : 'No ratings', color: 'bg-yellow-500/10 text-yellow-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card><CardContent className="p-4">
              <div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div><div className={`p-3 rounded-xl ${s.color}`}><s.icon className="w-6 h-6" /></div></div>
              <p className="text-sm text-muted-foreground mt-2">{s.sub}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Conversations This Week</CardTitle></CardHeader><CardContent>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.conversationsByDay}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="date" className="text-xs" /><YAxis className="text-xs" /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} /><Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} /></LineChart>
          </ResponsiveContainer></div>
        </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-base">Activity by Hour</CardTitle></CardHeader><CardContent>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.hourlyActivity.filter((_, i) => i % 2 === 0)}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="hour" className="text-xs" /><YAxis className="text-xs" /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer></div>
        </CardContent></Card>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader><CardContent>
          <div className="h-48"><ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={data.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
              {data.statusDistribution.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer></div>
        </CardContent></Card>
        <Card className="md:col-span-2"><CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl"><p className="text-sm text-muted-foreground">Total Conversations</p><p className="text-2xl font-bold">{data.totalConversations}</p></div>
            <div className="p-4 bg-muted/50 rounded-xl"><p className="text-sm text-muted-foreground">Active Now</p><p className="text-2xl font-bold text-green-500">{data.activeConversations}</p></div>
            <div className="p-4 bg-muted/50 rounded-xl"><p className="text-sm text-muted-foreground">Resolution Rate</p><p className="text-2xl font-bold">{data.resolvedRate}%</p></div>
            <div className="p-4 bg-muted/50 rounded-xl"><p className="text-sm text-muted-foreground">Avg Response Time</p><p className="text-2xl font-bold">{data.avgResponseTime}s</p></div>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
};
