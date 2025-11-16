import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
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
  const [onboardingComplete, setOnboardingComplete] = useState(false);

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
  const userEmail = (user as any)?.email;

  // If user has no associated manager record, show onboarding
  if (!manager && !onboardingComplete) {
    return (
      <Onboarding
        userEmail={userEmail}
        onComplete={() => {
          setOnboardingComplete(true);
          window.location.reload();
        }}
      />
    );
  }

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  // Route based on role
  if (manager.role === 'boss') {
    return (
      <BossDashboard
        language={language}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
      />
    );
  }

  if (manager.role === 'supervisor') {
    return (
      <SupervisorDashboard
        language={language}
        onLanguageChange={setLanguage}
        supervisorId={manager.id}
        onLogout={handleLogout}
      />
    );
  }

  // Default: regular manager role
  return (
    <ManagerDashboard
      language={language}
      onLanguageChange={setLanguage}
      managerId={manager.id}
      onLogout={handleLogout}
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
