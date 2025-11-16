import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Baby, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import FamilyDetailDialog from "@/components/FamilyDetailDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import type { Manager, Family, Child, GrowthRecord } from "@shared/schema";

interface SupervisorDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  supervisorId: string;
  onBackToRoleSelection?: () => void;
  onLogout?: () => void;
}

export default function SupervisorDashboard({ 
  language, 
  onLanguageChange, 
  supervisorId,
  onBackToRoleSelection,
  onLogout
}: SupervisorDashboardProps) {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families'>('overview');
  const [viewFamilyDetailOpen, setViewFamilyDetailOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');

  const { data: currentSupervisor, isLoading: supervisorLoading } = useQuery<Manager>({
    queryKey: ['/api/managers', supervisorId],
  });

  const { data: subordinateManagers = [], isLoading: managersLoading } = useQuery<Manager[]>({
    queryKey: ['/api/managers/supervisor', supervisorId],
  });

  const { data: allFamilies = [], isLoading: familiesLoading } = useQuery<Family[]>({
    queryKey: ['/api/families'],
  });

  const { data: allChildren = [], isLoading: childrenLoading } = useQuery<Child[]>({
    queryKey: ['/api/children'],
  });

  const { data: growthRecords = [], isLoading: recordsLoading } = useQuery<GrowthRecord[]>({
    queryKey: ['/api/growth-records'],
  });

  const isLoading = supervisorLoading || managersLoading || familiesLoading || childrenLoading || recordsLoading;

  const subordinateManagerIds = subordinateManagers.map(m => m.id);
  const subordinateFamilies = allFamilies.filter(f => f.managerId && subordinateManagerIds.includes(f.managerId));
  const subordinateFamilyIds = subordinateFamilies.map(f => f.id);
  const subordinateChildren = allChildren.filter(c => c.familyId && subordinateFamilyIds.includes(c.familyId));

  const totalChildren = subordinateChildren.length;
  const totalManagers = subordinateManagers.length;
  const highRiskFamilies = subordinateFamilies.filter(f => f.complianceStatus === 'red').length;
  const stableFamilies = subordinateFamilies.filter(f => f.complianceStatus === 'green').length;

  const performanceData = subordinateManagers.map(manager => {
    const managerFamilies = subordinateFamilies.filter(f => f.managerId === manager.id);
    const managerChildren = subordinateChildren.filter(c => 
      managerFamilies.some(f => f.id === c.familyId)
    );
    
    return {
      name: manager.name,
      height: Math.random() * 2 + 1,
      weight: Math.random() * 1 + 0.5,
    };
  });

  const upcomingBirthdays = subordinateChildren
    .slice(0, 5)
    .sort((a, b) => new Date(a.birthday).getMonth() - new Date(b.birthday).getMonth());

  const familyTableData = subordinateFamilies.map(family => {
    const manager = subordinateManagers.find(m => m.id === family.managerId);
    const childrenCount = subordinateChildren.filter(c => c.familyId === family.id).length;
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

  const managerTableData = subordinateManagers.map(manager => {
    const familiesCount = subordinateFamilies.filter(f => f.managerId === manager.id).length;
    const childrenCount = subordinateChildren.filter(c => 
      subordinateFamilies.some(f => f.id === c.familyId && f.managerId === manager.id)
    ).length;
    return {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      familiesCount,
      childrenCount,
    };
  });

  const handleViewFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setViewFamilyDetailOpen(true);
  };

  const selectedFamily = allFamilies.find(f => f.id === selectedFamilyId);
  const selectedFamilyChildren = allChildren.filter(c => c.familyId === selectedFamilyId);
  const selectedFamilyRecords = selectedFamilyChildren.reduce((acc, child) => {
    acc[child.id] = growthRecords.filter(r => r.childId === child.id);
    return acc;
  }, {} as { [childId: string]: typeof growthRecords });
  const selectedFamilyManager = subordinateManagers.find(m => m.id === selectedFamily?.managerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
          <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{language === 'zh-TW' ? '主任管理師儀表板' : 'Supervisor Dashboard'}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '管理旗下團隊' : 'Manage your team'}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{currentSupervisor?.name} - {language === 'zh-TW' ? '主任管理師儀表板' : 'Supervisor Dashboard'}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '管理旗下團隊' : 'Manage your team'}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className="transition-all duration-200"
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
            {language === 'zh-TW' ? '我的管理師' : 'My Managers'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title={t.totalChildren}
                value={totalChildren}
                icon={Baby}
                description={language === 'zh-TW' ? `${totalManagers} 位管理師負責` : `Managed by ${totalManagers} managers`}
              />
              <MetricCard
                title={language === 'zh-TW' ? '旗下管理師' : 'My Managers'}
                value={totalManagers}
                icon={Users}
                description={language === 'zh-TW' ? `平均負責 ${Math.round(subordinateFamilies.length / Math.max(totalManagers, 1))} 個家庭` : `Avg ${Math.round(subordinateFamilies.length / Math.max(totalManagers, 1))} families each`}
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
                  title={language === 'zh-TW' ? '旗下管理師表現' : 'Team Performance'}
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
                        {upcomingBirthdays.length > 0 ? (
                          upcomingBirthdays.map(child => (
                            <BirthdayCard
                              key={child.id}
                              childName={child.name}
                              birthday={child.birthday}
                              language={language}
                            />
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            {language === 'zh-TW' ? '暫無即將到來的生日' : 'No upcoming birthdays'}
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'managers' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'zh-TW' ? '旗下管理師名單' : 'My Managers'}</CardTitle>
              </CardHeader>
              <CardContent>
                {managerTableData.length > 0 ? (
                  <ManagerTable
                    managers={managerTableData}
                    language={language}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    hideActions={true}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {language === 'zh-TW' ? '尚無旗下管理師' : 'No managers yet'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'families' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.families}</CardTitle>
              </CardHeader>
              <CardContent>
                {familyTableData.length > 0 ? (
                  <FamilyTable
                    families={familyTableData}
                    language={language}
                    onView={handleViewFamily}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {language === 'zh-TW' ? '尚無家庭資料' : 'No families yet'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {selectedFamily && selectedFamilyManager && (
        <FamilyDetailDialog
          open={viewFamilyDetailOpen}
          onOpenChange={setViewFamilyDetailOpen}
          familyName={selectedFamily.familyName}
          country={selectedFamily.country}
          managerName={selectedFamilyManager.name}
          complianceStatus={selectedFamily.complianceStatus as 'red' | 'yellow' | 'green'}
          managerNotes={selectedFamily.managerNotes || ''}
          children={selectedFamilyChildren}
          childrenRecords={selectedFamilyRecords}
          language={language}
        />
      )}
    </div>
  );
}
