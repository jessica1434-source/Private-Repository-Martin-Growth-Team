import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import RoleSelector from "./pages/RoleSelector";
import TestModeMessage from "./pages/TestModeMessage";
import BossDashboard from "./pages/BossDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import type { Language } from "./lib/i18n";

function AppContent() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh-TW';
  });
  const [testRole, setTestRole] = useState<{ role: 'boss' | 'supervisor' | 'manager', managerId: string } | null>(() => {
    const saved = localStorage.getItem('testRole');
    return saved ? JSON.parse(saved) : null;
  });
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (testRole) {
      localStorage.setItem('testRole', JSON.stringify(testRole));
    }
  }, [testRole]);

  // Show landing page if not authenticated or still loading
  if (isLoading || !isAuthenticated) {
    return (
      <Landing />
    );
  }

  // Get manager information from user object (attached by backend)
  const manager = (user as any)?.manager;

  // If user has no associated manager record, show role selector for testing
  if (!manager && !testRole) {
    const userEmail = (user as any)?.email;
    return (
      <RoleSelector
        userEmail={userEmail}
        onRoleSelected={(role, managerId) => setTestRole({ role, managerId })}
      />
    );
  }

  // If user has a test role but no manager profile, show test mode message
  if (!manager && testRole) {
    const userEmail = (user as any)?.email;
    const roleNames = {
      boss: '老闆/總經理',
      supervisor: '主任管理師',
      manager: '管理師',
    };
    
    return (
      <TestModeMessage
        userEmail={userEmail}
        roleName={roleNames[testRole.role]}
        onBackToRoleSelection={() => {
          setTestRole(null);
          localStorage.removeItem('testRole');
        }}
        onLogout={() => {
          setTestRole(null);
          localStorage.removeItem('testRole');
          window.location.href = '/api/logout';
        }}
      />
    );
  }

  // Use manager profile for routing
  const effectiveRole = manager?.role;
  const effectiveManagerId = manager?.id;

  const handleBackToRoleSelection = () => {
    setTestRole(null);
    localStorage.removeItem('testRole');
  };

  const handleLogout = () => {
    setTestRole(null);
    localStorage.removeItem('testRole');
    window.location.href = '/api/logout';
  };

  // Route based on role
  if (effectiveRole === 'boss') {
    return (
      <BossDashboard
        language={language}
        onLanguageChange={setLanguage}
        onBackToRoleSelection={!manager ? handleBackToRoleSelection : undefined}
        onLogout={handleLogout}
      />
    );
  }

  if (effectiveRole === 'supervisor') {
    return (
      <SupervisorDashboard
        language={language}
        onLanguageChange={setLanguage}
        supervisorId={effectiveManagerId!}
        onBackToRoleSelection={!manager ? handleBackToRoleSelection : undefined}
        onLogout={handleLogout}
      />
    );
  }

  // Default: regular manager role
  return (
    <ManagerDashboard
      language={language}
      onLanguageChange={setLanguage}
      managerId={effectiveManagerId!}
      onBackToRoleSelection={!manager ? handleBackToRoleSelection : undefined}
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
