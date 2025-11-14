import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleSelection from "./pages/RoleSelection";
import ManagerSelection from "./pages/ManagerSelection";
import BossDashboard from "./pages/BossDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import type { Language } from "./lib/i18n";

function App() {
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [selectedRole, setSelectedRole] = useState<'boss' | 'manager' | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');

  const handleRoleSelect = (role: 'boss' | 'manager') => {
    setSelectedRole(role);
  };

  const handleManagerSelect = (managerId: string) => {
    setSelectedManagerId(managerId);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setSelectedManagerId('');
  };

  const handleBackToManagerSelection = () => {
    setSelectedManagerId('');
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
            onBack={handleBackToRoleSelection}
          />
        )}
        {selectedRole === 'manager' && !selectedManagerId && (
          <ManagerSelection
            language={language}
            onLanguageChange={setLanguage}
            onSelectManager={handleManagerSelect}
            onBack={handleBackToRoleSelection}
          />
        )}
        {selectedRole === 'manager' && selectedManagerId && (
          <ManagerDashboard
            language={language}
            onLanguageChange={setLanguage}
            managerId={selectedManagerId}
            onBack={handleBackToManagerSelection}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
