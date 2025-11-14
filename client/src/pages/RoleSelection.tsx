import { Briefcase, Users } from "lucide-react";
import RoleCard from "@/components/RoleCard";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface RoleSelectionProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectRole: (role: 'boss' | 'manager') => void;
}

export default function RoleSelection({ language, onLanguageChange, onSelectRole }: RoleSelectionProps) {
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {language === 'zh-TW' ? '兒童成長管理系統' : 'Children Growth Management'}
          </h1>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">{t.selectRole}</h2>
            <p className="text-muted-foreground">
              {language === 'zh-TW' 
                ? '請選擇您的身份以開始使用系統' 
                : 'Please select your role to access the system'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoleCard
              title={t.boss}
              description={t.bossDescription}
              icon={Briefcase}
              onClick={() => onSelectRole('boss')}
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
