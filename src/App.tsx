import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ClientOnboarding from "./pages/ClientOnboarding";
import BookingFlow from "./pages/BookingFlow";
import ProjectProfile from "./pages/ProjectProfile";
import BriefProfile from "./pages/BriefProfile";
import CreativeProfile from "./pages/CreativeProfile";
import ClientProfile from "./pages/ClientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/client-onboarding" element={<ClientOnboarding />} />
            <Route path="/explore" element={<BookingFlow />} />
            <Route path="/dashboard" element={<BookingFlow />} />
            <Route path="/messages" element={<BookingFlow />} />
            <Route path="/booking" element={<BookingFlow />} />
            <Route path="/brief/:id" element={<BriefProfile />} />
            <Route path="/project/:id" element={<ProjectProfile />} />
            <Route path="/creative/:id" element={<CreativeProfile />} />
            <Route path="/client/:id" element={<ClientProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
