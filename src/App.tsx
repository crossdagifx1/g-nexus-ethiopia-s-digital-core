import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import AIChatWidget from "@/components/AIChatWidget";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebDevelopment from "./pages/WebDevelopment";
import ThreeDArchitecture from "./pages/ThreeDArchitecture";
import AIAutomation from "./pages/AIAutomation";
import GNexusPlatform from "./pages/GNexusPlatform";
import About from "./pages/About";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Documentation from "./pages/Documentation";
import Status from "./pages/Status";
import Portfolio from "./pages/Portfolio";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/3d-architecture" element={<ThreeDArchitecture />} />
            <Route path="/ai-automation" element={<AIAutomation />} />
            <Route path="/gnexus" element={<GNexusPlatform />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/status" element={<Status />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/support" element={<Support />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
        <ChatWidgetWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const ChatWidgetWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ['/admin', '/auth'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;
  return <AIChatWidget />;
};

export default App;
