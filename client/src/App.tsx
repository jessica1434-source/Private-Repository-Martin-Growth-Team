import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BossDashboard from "./pages/BossDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import type { Language } from "./lib/i18n";

function AppContent() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh-TW';
  });
  const [showRegister, setShowRegister] = useState(false);
  const { manager, isLoading, isAuthenticated, refetch } = useAuth();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">載入中...</div>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated || !manager) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() => refetch()}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    
    return (
      <Login
        onLoginSuccess={() => refetch()}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.reload();
    }
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
