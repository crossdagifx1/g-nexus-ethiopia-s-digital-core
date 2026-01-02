import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquare, FolderOpen, Settings, 
  Users, LogOut, Menu, X, ChevronRight, BarChart3,
  Bot, Eye, Trash2, Edit2, Plus, Loader2, Shield, User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormDialog } from '@/components/admin/ProjectFormDialog';
import { UserRolesManager } from '@/components/admin/UserRolesManager';
import type { User } from '@supabase/supabase-js';

interface Conversation {
  id: string;
  session_id: string;
  user_email: string | null;
  created_at: string;
  status: string;
  message_count?: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  client: string | null;
  featured: boolean | null;
  created_at: string;
  image_url: string | null;
  technologies: string[] | null;
  project_url: string | null;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalProjects: 0,
    activeConversations: 0,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        setIsLoading(false);
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch conversations
      const { data: convData } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      setConversations(convData || []);
      
      // Fetch projects
      const { data: projData } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      setProjects(projData || []);

      // Calculate stats
      setStats({
        totalChats: convData?.length || 0,
        totalProjects: projData?.length || 0,
        activeConversations: convData?.filter(c => c.status === 'active').length || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchChatMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    setChatMessages(data || []);
    setSelectedConversation(conversationId);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast({ title: 'Project deleted successfully' });
      fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ 
        title: 'Error deleting project', 
        variant: 'destructive' 
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectDialogOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chats', icon: MessageSquare, label: 'AI Chats' },
    { id: 'projects', icon: FolderOpen, label: 'Portfolio' },
    { id: 'users', icon: Shield, label: 'User Roles' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -240 }}
        className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <div>
              <h2 className="font-bold">G-Squad</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-6'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-bold capitalize">{activeTab === 'users' ? 'User Roles' : activeTab}</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-card border border-border rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <h3 className="text-3xl font-bold">{stats.totalChats}</h3>
                  <p className="text-muted-foreground">Total Conversations</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 bg-card border border-border rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FolderOpen className="w-8 h-8 text-primary" />
                    <Badge variant="secondary">All Time</Badge>
                  </div>
                  <h3 className="text-3xl font-bold">{stats.totalProjects}</h3>
                  <p className="text-muted-foreground">Portfolio Projects</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-card border border-border rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Bot className="w-8 h-8 text-green-500" />
                    <Badge className="bg-green-500/10 text-green-500">Live</Badge>
                  </div>
                  <h3 className="text-3xl font-bold">{stats.activeConversations}</h3>
                  <p className="text-muted-foreground">Active Chats</p>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Conversations</h3>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conv) => (
                    <div key={conv.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{conv.session_id.slice(0, 20)}...</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setActiveTab('chats');
                          fetchChatMessages(conv.id);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">All Conversations</h3>
                  <Badge variant="secondary">{conversations.length}</Badge>
                </div>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => fetchChatMessages(conv.id)}
                        className={`w-full p-3 rounded-xl text-left transition-colors ${
                          selectedConversation === conv.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                            <span className="text-sm font-medium truncate">
                              Session #{conv.session_id.slice(-8)}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <div className={`flex items-center justify-between mt-1 ${
                          selectedConversation === conv.id 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          <p className="text-xs">
                            {new Date(conv.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs">
                            {new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {conv.user_email && (
                          <p className={`text-xs mt-1 truncate ${
                            selectedConversation === conv.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {conv.user_email}
                          </p>
                        )}
                      </button>
                    ))}
                    {conversations.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No conversations yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat View */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Chat History</h3>
                      {selectedConversation && (
                        <p className="text-xs text-muted-foreground">
                          {chatMessages.length} messages in this conversation
                        </p>
                      )}
                    </div>
                    {selectedConversation && (
                      <Badge variant="outline">
                        {conversations.find(c => c.id === selectedConversation)?.status || 'Unknown'}
                      </Badge>
                    )}
                  </div>
                </div>
                {selectedConversation ? (
                  <ScrollArea className="h-[560px] p-4">
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {msg.role === 'user' ? (
                              <UserIcon className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`max-w-[75%] p-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${
                                msg.role === 'user' ? 'text-primary-foreground/80' : 'text-foreground'
                              }`}>
                                {msg.role === 'user' ? 'Customer' : 'Tsion (AI)'}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-[10px] mt-2 ${
                              msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                            }`}>
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[560px] flex flex-col items-center justify-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p>Select a conversation to view full chat history</p>
                    <p className="text-sm mt-1">All messages are stored and accessible here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-card border border-border rounded-2xl">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Portfolio Projects</h3>
                <Button size="sm" onClick={handleAddProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        {project.image_url ? (
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.category}</Badge>
                      </TableCell>
                      <TableCell>{project.client || '-'}</TableCell>
                      <TableCell>
                        {project.featured ? (
                          <Badge className="bg-primary">Featured</Badge>
                        ) : (
                          <Badge variant="secondary">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the project "{project.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <UserRolesManager />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Analytics</h3>
              <p className="text-muted-foreground">
                Analytics dashboard coming soon. Track visitor engagement, chat metrics, and conversion rates.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <p className="text-muted-foreground">
                Site settings and configuration options coming soon.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={editingProject}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Admin;
