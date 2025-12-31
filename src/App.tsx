import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SnowEffect from "@/components/SnowEffect";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Scholarships from "./pages/Scholarships";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import VideoLearning from "./pages/VideoLearning";
import MentorMatching from "./pages/MentorMatching";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// Protected Route components
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SnowEffect />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
                <Route path="/features" element={<PublicRoute><Features /></PublicRoute>} />
                <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
                <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
                
                {/* Auth routes - accessible without login */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
                <Route path="/video-learning" element={<ProtectedRoute><VideoLearning /></ProtectedRoute>} />
                <Route path="/mentor-matching" element={<ProtectedRoute><MentorMatching /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                
                {/* Admin route - role check is done inside the component */}
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
