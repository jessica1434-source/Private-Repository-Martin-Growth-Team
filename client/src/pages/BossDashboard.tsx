import { useState } from "react";
import { Baby, Users, AlertTriangle, CheckCircle, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import TrendChart from "@/components/TrendChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import AddManagerDialog from "@/components/AddManagerDialog";
import AddFamilyDialog from "@/components/AddFamilyDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import { mockManagers, mockFamilies, mockChildren } from "@/lib/mockData";

interface BossDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
}

export default function BossDashboard({ language, onLanguageChange, onBack }: BossDashboardProps) {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families'>('overview');
  const [addManagerOpen, setAddManagerOpen] = useState(false);
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);

  //todo: remove mock functionality
  const totalChildren = mockChildren.length;
  const totalManagers = mockManagers.length;
  const highRiskFamilies = mockFamilies.filter(f => f.complianceStatus === 'red').length;
  const stableFamilies = mockFamilies.filter(f => f.complianceStatus === 'green').length;

  const performanceData = [
    { name: '陳美玲', height: 2.3, weight: 0.8 },
    { name: '林志明', height: 1.9, weight: 0.6 },
    { name: '王小華', height: 2.5, weight: 0.9 },
    { name: '張雅婷', height: 2.1, weight: 0.7 },
  ];

  const trendData = {
    taiwan: [
      { month: '7月', height: 118.5, weight: 22.3 },
      { month: '8月', height: 119.2, weight: 22.8 },
      { month: '9月', height: 120.1, weight: 23.2 },
      { month: '10月', height: 120.8, weight: 23.7 },
      { month: '11月', height: 121.5, weight: 24.1 },
    ],
    singapore: [
      { month: '7月', height: 117.2, weight: 21.8 },
      { month: '8月', height: 118.1, weight: 22.3 },
      { month: '9月', height: 118.9, weight: 22.7 },
      { month: '10月', height: 119.6, weight: 23.1 },
      { month: '11月', height: 120.3, weight: 23.5 },
    ],
    malaysia: [
      { month: 'Jul', height: 116.8, weight: 21.5 },
      { month: 'Aug', height: 117.6, weight: 22.0 },
      { month: 'Sep', height: 118.4, weight: 22.4 },
      { month: 'Oct', height: 119.1, weight: 22.9 },
      { month: 'Nov', height: 119.8, weight: 23.3 },
    ],
    brunei: [
      { month: 'Jul', height: 118.0, weight: 22.1 },
      { month: 'Aug', height: 118.7, weight: 22.6 },
      { month: 'Sep', height: 119.5, weight: 23.0 },
      { month: 'Oct', height: 120.2, weight: 23.5 },
      { month: 'Nov', height: 121.0, weight: 23.9 },
    ],
  };

  const upcomingBirthdays = mockChildren
    .slice(0, 5)
    .sort((a, b) => new Date(a.birthday).getMonth() - new Date(b.birthday).getMonth());

  const familyTableData = mockFamilies.map(family => {
    const manager = mockManagers.find(m => m.id === family.managerId);
    const childrenCount = mockChildren.filter(c => c.familyId === family.id).length;
    return {
      id: family.id,
      familyName: family.familyName,
      country: family.country === 'taiwan' ? t.taiwan : 
               family.country === 'singapore' ? t.singapore :
               family.country === 'malaysia' ? t.malaysia : t.brunei,
      managerName: manager?.name || '-',
      childrenCount,
      complianceStatus: family.complianceStatus as 'red' | 'yellow' | 'green',
      notes: family.managerNotes || '',
    };
  });

  const managerTableData = mockManagers.map(manager => {
    const familiesCount = mockFamilies.filter(f => f.managerId === manager.id).length;
    const childrenCount = mockChildren.filter(c => 
      mockFamilies.some(f => f.id === c.familyId && f.managerId === manager.id)
    ).length;
    return {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      familiesCount,
      childrenCount,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-semibold">{t.dashboard}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            data-testid="button-tab-overview"
          >
            {t.dashboard}
          </Button>
          <Button 
            variant={activeTab === 'managers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('managers')}
            data-testid="button-tab-managers"
          >
            {language === 'zh-TW' ? '管理師管理' : 'Managers'}
          </Button>
          <Button 
            variant={activeTab === 'families' ? 'default' : 'outline'}
            onClick={() => setActiveTab('families')}
            data-testid="button-tab-families"
          >
            {t.families}
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={t.totalChildren}
                value={totalChildren}
                icon={Baby}
                description={language === 'zh-TW' ? '跨 4 個國家' : 'Across 4 countries'}
              />
              <MetricCard
                title={t.totalManagers}
                value={totalManagers}
                icon={Users}
                description={language === 'zh-TW' ? `平均負責 ${Math.round(mockFamilies.length / totalManagers)} 個家庭` : `Avg ${Math.round(mockFamilies.length / totalManagers)} families each`}
              />
              <MetricCard
                title={t.highRiskFamilies}
                value={highRiskFamilies}
                icon={AlertTriangle}
              />
              <MetricCard
                title={t.stableFamilies}
                value={stableFamilies}
                icon={CheckCircle}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PerformanceChart
                  title={t.managerPerformance}
                  data={performanceData}
                  language={language}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t.upcomingBirthdays}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[360px]">
                      <div className="space-y-3">
                        {upcomingBirthdays.map(child => (
                          <BirthdayCard
                            key={child.id}
                            childName={child.name}
                            birthday={child.birthday}
                            language={language}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            <TrendChart
              title={t.crossCountryTrends}
              data={trendData}
              language={language}
            />
          </div>
        )}

        {activeTab === 'managers' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{language === 'zh-TW' ? '管理師名單' : 'Manager List'}</CardTitle>
                <Button onClick={() => setAddManagerOpen(true)} data-testid="button-add-manager">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'zh-TW' ? '新增管理師' : 'Add Manager'}
                </Button>
              </CardHeader>
              <CardContent>
                <ManagerTable
                  managers={managerTableData}
                  language={language}
                  onEdit={(id) => console.log('Edit manager:', id)}
                  onDelete={(id) => console.log('Delete manager:', id)}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'families' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{t.families}</CardTitle>
                <Button onClick={() => setAddFamilyOpen(true)} data-testid="button-add-family">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'zh-TW' ? '建立家庭資料' : 'Create Family'}
                </Button>
              </CardHeader>
              <CardContent>
                <FamilyTable
                  families={familyTableData}
                  language={language}
                  onView={(id) => console.log('View family:', id)}
                  onEdit={(id) => console.log('Edit family:', id)}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <AddManagerDialog
        open={addManagerOpen}
        onOpenChange={setAddManagerOpen}
        language={language}
        onSave={(data) => console.log('Manager saved:', data)}
      />

      <AddFamilyDialog
        open={addFamilyOpen}
        onOpenChange={setAddFamilyOpen}
        language={language}
        managers={mockManagers}
        onSave={(data) => console.log('Family saved:', data)}
      />
    </div>
  );
}
