import { Briefcase, Users, UserCog } from "lucide-react";
import RoleCard from "@/components/RoleCard";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface RoleSelectionProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectRole: (role: 'boss' | 'supervisor' | 'manager') => void;
}

export default function RoleSelection({ language, onLanguageChange, onSelectRole }: RoleSelectionProps) {
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {language === 'zh-TW' ? '兒童成長管理系統' : 'Children Growth Management'}
          </h1>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.selectRole}</h2>
            <p className="text-lg text-muted-foreground">
              {language === 'zh-TW' 
                ? '請選擇您的身份以開始使用系統' 
                : 'Please select your role to access the system'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <RoleCard
              title={t.boss}
              description={t.bossDescription}
              icon={Briefcase}
              onClick={() => onSelectRole('boss')}
            />
            <RoleCard
              title={t.supervisor}
              description={t.supervisorDescription}
              icon={UserCog}
              onClick={() => onSelectRole('supervisor')}
            />
            <RoleCard
              title={t.manager}
              description={t.managerDescription}
              icon={Users}
              onClick={() => onSelectRole('manager')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
