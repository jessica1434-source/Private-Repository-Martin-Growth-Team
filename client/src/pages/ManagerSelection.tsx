import { Card, CardContent } from "@/components/ui/card";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface ManagerSelectionProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectManager: (managerId: string) => void;
  onBack: () => void;
  managers: Manager[];
}

export default function ManagerSelection({ 
  language, 
  onLanguageChange, 
  onSelectManager,
  onBack,
  managers
}: ManagerSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {language === 'zh-TW' ? '選擇管理師身份' : 'Select Manager'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground">
              {language === 'zh-TW' 
                ? '請選擇您的管理師帳號以繼續' 
                : 'Please select your manager account to continue'}
            </p>
          </div>
          <div className="grid gap-4">
            {managers.map((manager) => (
              <Card 
                key={manager.id}
                className="cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 hover:shadow-lg group"
                onClick={() => onSelectManager(manager.id)}
                data-testid={`card-manager-${manager.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <span className="text-2xl font-bold text-primary">
                        {manager.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{manager.name}</h3>
                      <p className="text-sm text-muted-foreground">{manager.email}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
