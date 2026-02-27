import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, User, Minimize2, Check, CheckCheck, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
}

type ChatMode = 'agent' | 'gnexus';

const AGENTS = {
  agent: { name: "Tsion", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face", greeting: "ሰላም! 👋 I'm Tsion from G-Squad. How can I help you today?", subtitle: "G-Squad Support" },
  gnexus: { name: "G-Nexus AI", avatar: "", greeting: "Welcome to G-Nexus AI! 🚀 Ask me anything about the G-Nexus platform.", subtitle: "Platform Assistant" },
};

const QUICK_REPLIES = {
  agent: ["Tell me about your services", "I need a website", "What are your prices?", "Book a consultation"],
  gnexus: ["What is G-Nexus?", "Platform pricing", "Payment integrations", "How to get started"],
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('agent');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [messages, setMessages] = useState<Record<ChatMode, Message[]>>({
    agent: [{ id: '1', role: 'assistant', content: AGENTS.agent.greeting, timestamp: new Date(), status: 'seen' }],
    gnexus: [{ id: '1', role: 'assistant', content: AGENTS.gnexus.greeting, timestamp: new Date(), status: 'seen' }],
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMessages = messages[chatMode];
  const agent = AGENTS[chatMode];

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [currentMessages, isTyping]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);
  useEffect(() => { if (isOpen) setMessages(prev => ({ ...prev, [chatMode]: prev[chatMode].map(msg => msg.role === 'assistant' ? { ...msg, status: 'seen' as const } : msg) })); }, [isOpen, chatMode]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date(), status: 'sending' };
    setMessages(prev => ({ ...prev, [chatMode]: [...prev[chatMode], userMessage] }));
    setInput('');
    setTimeout(() => setMessages(prev => ({ ...prev, [chatMode]: prev[chatMode].map(msg => msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg) })), 300);
    setTimeout(() => setMessages(prev => ({ ...prev, [chatMode]: prev[chatMode].map(msg => msg.id === userMessage.id ? { ...msg, status: 'delivered' as const } : msg) })), 800);
    setIsLoading(true); setIsTyping(true);
    setTimeout(() => setMessages(prev => ({ ...prev, [chatMode]: prev[chatMode].map(msg => msg.id === userMessage.id ? { ...msg, status: 'seen' as const } : msg) })), 1200);
    try {
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
      const { data, error } = await supabase.functions.invoke('ai-chat', { body: { message: text, sessionId, conversationId, mode: chatMode } });
      if (error) throw error;
      if (data.conversationId && !conversationId) setConversationId(data.conversationId);
      setIsTyping(false);
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date(), status: 'delivered' };
      setMessages(prev => ({ ...prev, [chatMode]: [...prev[chatMode], assistantMessage] }));
      setTimeout(() => setMessages(prev => ({ ...prev, [chatMode]: prev[chatMode].map(msg => msg.id === assistantMessage.id ? { ...msg, status: 'seen' as const } : msg) })), 500);
    } catch (error) {
      console.error('Chat error:', error); setIsTyping(false);
      setMessages(prev => ({ ...prev, [chatMode]: [...prev[chatMode], { id: (Date.now() + 1).toString(), role: 'assistant', content: "Sorry, I'm having connection issues. Please try again.", timestamp: new Date(), status: 'delivered' }] }));
    } finally { setIsLoading(false); }
  };

  const renderMessageStatus = (message: Message) => {
    if (message.role !== 'user') return null;
    switch (message.status) {
      case 'sending': return <Loader2 className="w-3 h-3 animate-spin opacity-50" />;
      case 'sent': return <Check className="w-3 h-3 opacity-50" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 opacity-50" />;
      case 'seen': return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <>
      {/* FAB Stack */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {showModeSelector && (
              <>
                <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.1 }}
                  onClick={() => { setChatMode('gnexus'); setIsOpen(true); setShowModeSelector(false); }}
                  className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </motion.button>
                <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  onClick={() => { setChatMode('agent'); setIsOpen(true); setShowModeSelector(false); }}
                  className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-xl flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </motion.button>
              </>
            )}
            <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setShowModeSelector(!showModeSelector)}
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-2xl flex items-center justify-center text-primary-foreground hover:shadow-primary/25 transition-shadow">
              <MessageCircle className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1, height: isMinimized ? 'auto' : '600px' }} exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className={`p-4 flex items-center justify-between text-primary-foreground ${chatMode === 'gnexus' ? 'bg-gradient-to-r from-cyan-600 to-blue-700' : 'bg-gradient-to-r from-primary to-primary/80'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {agent.avatar ? <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" /> : <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-current" />
                </div>
                <div><h3 className="font-semibold">{agent.name}</h3><p className="text-xs opacity-80">{isTyping ? 'Typing...' : `Online • ${agent.subtitle}`}</p></div>
              </div>
              <div className="flex items-center gap-1">
                {/* Mode Switch */}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                  onClick={() => setChatMode(chatMode === 'agent' ? 'gnexus' : 'agent')}>
                  {chatMode === 'agent' ? <Sparkles className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => setIsMinimized(!isMinimized)}><Minimize2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => { setIsOpen(false); setShowModeSelector(false); }}><X className="w-4 h-4" /></Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.role === 'assistant' ? (
                          agent.avatar ? <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> : <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-cyan-500" /></div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>
                        )}
                        <div className={`max-w-[75%] p-3 rounded-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            <p className={`text-[10px] ${message.role === 'user' ? 'opacity-70' : 'text-muted-foreground'}`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {renderMessageStatus(message)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        {agent.avatar ? <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> : <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-cyan-500" /></div>}
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                          <div className="flex gap-1 items-center"><span className="text-xs text-muted-foreground mr-2">{agent.name} is typing</span>
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {currentMessages.length <= 2 && !isLoading && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES[chatMode].map((reply, index) => (
                        <motion.button key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
                          onClick={() => sendMessage(reply)}
                          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors border border-primary/20">
                          {reply}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Message ${agent.name}...`} className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary" disabled={isLoading} />
                    <Button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} size="icon" className="bg-primary hover:bg-primary/90">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">Chat with {agent.name} • Powered by G-Squad AI</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
