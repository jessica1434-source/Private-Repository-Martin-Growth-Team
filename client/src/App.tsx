import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleSelection from "./pages/RoleSelection";
import BossDashboard from "./pages/BossDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import type { Language } from "./lib/i18n";

function App() {
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [selectedRole, setSelectedRole] = useState<'boss' | 'manager' | null>(null);

  const handleRoleSelect = (role: 'boss' | 'manager') => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!selectedRole && (
          <RoleSelection
            language={language}
            onLanguageChange={setLanguage}
            onSelectRole={handleRoleSelect}
          />
        )}
        {selectedRole === 'boss' && (
          <BossDashboard
            language={language}
            onLanguageChange={setLanguage}
            onBack={handleBack}
          />
        )}
        {selectedRole === 'manager' && (
          <ManagerDashboard
            language={language}
            onLanguageChange={setLanguage}
            onBack={handleBack}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
