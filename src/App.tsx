import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext";
import { CreativeProfileProvider } from "./context/CreativeProfileContext";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ClientOnboarding from "./pages/ClientOnboarding";
import BookingFlow from "./pages/BookingFlow";
import ProjectProfile from "./pages/ProjectProfile";
import BriefProfile from "./pages/BriefProfile";
import CreativeProfile from "./pages/CreativeProfile";
import ClientProfile from "./pages/ClientProfile";
import CreativeSettings from "./pages/CreativeSettings";
import DesignExport from "./pages/DesignExport";
import CompletedProjectProfile from "./pages/CompletedProjectProfile";
import DashboardPreview from "./pages/DashboardPreview";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectProvider>
        <CreativeProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
              <Route path="/settings" element={<CreativeSettings />} />
              <Route path="/completed/:id" element={<CompletedProjectProfile />} />
              <Route path="/designs" element={<DesignExport />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/dashboard-preview" element={<DashboardPreview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CreativeProfileProvider>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
