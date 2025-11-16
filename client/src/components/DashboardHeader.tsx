import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import type { Language } from "@/lib/i18n";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout?: () => void;
  onBackToRoleSelection?: () => void;
}

export default function DashboardHeader({
  title,
  subtitle,
  language,
  onLanguageChange,
  onLogout,
  onBackToRoleSelection,
}: DashboardHeaderProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Clear test role and redirect to logout
      localStorage.removeItem('testRole');
      window.location.href = '/api/logout';
    }
  };

  const handleBackToRoleSelection = () => {
    if (onBackToRoleSelection) {
      onBackToRoleSelection();
    } else {
      // Clear test role to show role selector again
      localStorage.removeItem('testRole');
      window.location.reload();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b mb-6">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onBackToRoleSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToRoleSelection}
              data-testid="button-back-to-role-selection"
            >
              <Home className="h-4 w-4 mr-2" />
              返回角色選擇
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(language === 'zh-TW' ? 'en' : 'zh-TW')}
          >
            {language === 'zh-TW' ? 'English' : '中文'}
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            登出
          </Button>
        </div>
      </div>
    </div>
  );
}
