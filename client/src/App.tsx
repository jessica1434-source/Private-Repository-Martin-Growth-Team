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
import { mockManagers, mockFamilies, mockChildren, mockGrowthRecords } from "./lib/mockData";

function App() {
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [selectedRole, setSelectedRole] = useState<'boss' | 'manager' | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');

  //todo: remove mock functionality - shared data state across all views
  const [managers, setManagers] = useState(mockManagers);
  const [families, setFamilies] = useState(mockFamilies);
  const [children, setChildren] = useState(mockChildren);
  const [growthRecords, setGrowthRecords] = useState(mockGrowthRecords);

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
            managers={managers}
            setManagers={setManagers}
            families={families}
            setFamilies={setFamilies}
            children={children}
            setChildren={setChildren}
          />
        )}
        {selectedRole === 'manager' && !selectedManagerId && (
          <ManagerSelection
            language={language}
            onLanguageChange={setLanguage}
            onSelectManager={handleManagerSelect}
            onBack={handleBackToRoleSelection}
            managers={managers}
          />
        )}
        {selectedRole === 'manager' && selectedManagerId && (
          <ManagerDashboard
            language={language}
            onLanguageChange={setLanguage}
            managerId={selectedManagerId}
            onBack={handleBackToManagerSelection}
            managers={managers}
            families={families}
            setFamilies={setFamilies}
            children={children}
            growthRecords={growthRecords}
            setGrowthRecords={setGrowthRecords}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
