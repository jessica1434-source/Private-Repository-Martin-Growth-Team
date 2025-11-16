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
    const userEmail = (user as any)?.email;
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">無法訪問系統</h1>
          <p className="text-muted-foreground mb-4">
            您的帳號 ({userEmail}) 沒有關聯的管理師資料。
          </p>
          <div className="bg-muted/50 p-6 rounded-lg mb-4 text-left">
            <h2 className="font-semibold mb-3">請使用以下測試帳號登入：</h2>
            <div className="space-y-2 text-sm">
              <p><strong>老闆帳號：</strong> boss@example.com</p>
              <p><strong>主任管理師：</strong> supervisor1@example.com 或 supervisor2@example.com</p>
              <p><strong>管理師：</strong> manager1@example.com ~ manager4@example.com</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/api/logout'}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            登出並重新登入
          </button>
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
