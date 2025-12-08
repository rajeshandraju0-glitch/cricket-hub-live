import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Matches from "./pages/Matches";
import Dashboard from "./pages/Dashboard";
import LiveScoring from "./pages/LiveScoring";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import Subscribe from "./pages/Subscribe";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/tournaments/new" element={
              <ProtectedRoute requiredRole="admin">
                <CreateTournament />
              </ProtectedRoute>
            } />
            <Route path="/live-scoring" element={
              <ProtectedRoute requiredRole="admin">
                <LiveScoring />
              </ProtectedRoute>
            } />
            <Route path="/live-scoring/:matchId" element={
              <ProtectedRoute requiredRole="admin">
                <LiveScoring />
              </ProtectedRoute>
            } />
            <Route path="/superadmin" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
