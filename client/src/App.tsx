import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import BossDashboard from "./pages/BossDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import type { Language } from "./lib/i18n";

function AppContent() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh-TW';
  });
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Show landing page if not authenticated or still loading
  if (isLoading || !isAuthenticated) {
    return (
      <Landing />
    );
  }

  // Get manager information from user object (attached by backend)
  const manager = (user as any)?.manager;

  // If user has no associated manager record, show error message
  if (!manager) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">No manager profile found for your account.</p>
          <p className="text-sm text-muted-foreground">Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  // Route based on manager role
  if (manager.role === 'boss') {
    return (
      <BossDashboard
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  if (manager.role === 'supervisor') {
    return (
      <SupervisorDashboard
        language={language}
        onLanguageChange={setLanguage}
        supervisorId={manager.id}
      />
    );
  }

  // Default: regular manager role
  return (
    <ManagerDashboard
      language={language}
      onLanguageChange={setLanguage}
      managerId={manager.id}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
