import { useState } from "react";
import { Baby, Users, AlertTriangle, CheckCircle, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import AddFamilyDialog from "@/components/AddFamilyDialog";
import FamilyStatusDialog from "@/components/FamilyStatusDialog";
import FamilyDetailDialog from "@/components/FamilyDetailDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface Manager {
  id: string;
  name: string;
  email: string;
  role?: string;
  supervisorId?: string | null;
}

interface Family {
  id: string;
  familyName: string;
  country: string;
  managerId: string;
  complianceStatus: string;
  managerNotes: string;
}

interface Child {
  id: string;
  name: string;
  birthday: string;
  familyId: string;
}

interface GrowthRecord {
  id: string;
  childId: string;
  recordDate: string;
  height: number;
  weight: number;
  notes: string;
}

interface SupervisorDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  supervisorId: string;
  managers: Manager[];
  families: Family[];
  setFamilies: (families: Family[]) => void;
  children: Child[];
  setChildren: (children: Child[]) => void;
  growthRecords: GrowthRecord[];
  setGrowthRecords: (records: GrowthRecord[]) => void;
}

export default function SupervisorDashboard({ 
  language, 
  onLanguageChange, 
  onBack,
  supervisorId,
  managers,
  families,
  setFamilies,
  children,
  setChildren,
  growthRecords,
  setGrowthRecords
}: SupervisorDashboardProps) {
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families'>('overview');
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [editFamilyStatusOpen, setEditFamilyStatusOpen] = useState(false);
  const [viewFamilyDetailOpen, setViewFamilyDetailOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');

  const subordinateManagers = managers.filter(m => m.supervisorId === supervisorId);
  const subordinateManagerIds = subordinateManagers.map(m => m.id);
  const subordinateFamilies = families.filter(f => subordinateManagerIds.includes(f.managerId));
  const subordinateFamilyIds = subordinateFamilies.map(f => f.id);
  const subordinateChildren = children.filter(c => subordinateFamilyIds.includes(c.familyId));

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
    const manager = managers.find(m => m.id === family.managerId);
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

  const handleAddFamily = (data: {
    familyName: string;
    country: string;
    managerId: string;
    children: Array<{ name: string; birthday: string; initialHeight: string; initialWeight: string }>;
  }) => {
    const newFamilyId = `f${families.length + 1}`;
    const newFamily = {
      id: newFamilyId,
      familyName: data.familyName,
      country: data.country,
      managerId: data.managerId,
      complianceStatus: 'green',
      managerNotes: '',
    };
    setFamilies([...families, newFamily]);

    const newChildren = data.children.map((child, index) => ({
      id: `c${children.length + index + 1}`,
      name: child.name,
      birthday: child.birthday,
      familyId: newFamilyId,
    }));
    setChildren([...children, ...newChildren]);

    const today = new Date().toISOString().split('T')[0];
    const initialRecords = data.children.map((child, index) => ({
      id: `gr${growthRecords.length + index + 1}`,
      childId: `c${children.length + index + 1}`,
      recordDate: today,
      height: parseFloat(child.initialHeight),
      weight: parseFloat(child.initialWeight),
      notes: language === 'zh-TW' ? '初始紀錄' : 'Initial record',
    }));
    setGrowthRecords([...growthRecords, ...initialRecords]);
  };

  const handleViewFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setViewFamilyDetailOpen(true);
  };

  const handleEditFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setEditFamilyStatusOpen(true);
  };

  const handleUpdateFamilyStatus = (data: { status: 'red' | 'yellow' | 'green'; notes: string }) => {
    setFamilies(families.map(f => 
      f.id === selectedFamilyId 
        ? { ...f, complianceStatus: data.status, managerNotes: data.notes }
        : f
    ));
  };

  const selectedFamily = families.find(f => f.id === selectedFamilyId);
  const selectedFamilyChildren = children.filter(c => c.familyId === selectedFamilyId);
  const selectedFamilyRecords = selectedFamilyChildren.reduce((acc, child) => {
    acc[child.id] = growthRecords.filter(r => r.childId === child.id);
    return acc;
  }, {} as { [childId: string]: typeof growthRecords });
  const selectedFamilyManager = managers.find(m => m.id === selectedFamily?.managerId);

  const currentSupervisor = managers.find(m => m.id === supervisorId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back" className="hover:bg-primary/10">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{currentSupervisor?.name} - {language === 'zh-TW' ? '主任管理師儀表板' : 'Supervisor Dashboard'}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '管理旗下團隊' : 'Manage your team'}</p>
            </div>
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{t.families}</CardTitle>
                <Button onClick={() => setAddFamilyOpen(true)} data-testid="button-add-family">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'zh-TW' ? '建立家庭資料' : 'Create Family'}
                </Button>
              </CardHeader>
              <CardContent>
                {familyTableData.length > 0 ? (
                  <FamilyTable
                    families={familyTableData}
                    language={language}
                    onView={handleViewFamily}
                    onEdit={handleEditFamily}
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

      <AddFamilyDialog
        open={addFamilyOpen}
        onOpenChange={setAddFamilyOpen}
        language={language}
        managers={subordinateManagers}
        onSave={handleAddFamily}
      />

      {selectedFamily && (
        <FamilyStatusDialog
          open={editFamilyStatusOpen}
          onOpenChange={setEditFamilyStatusOpen}
          familyName={selectedFamily.familyName}
          currentStatus={selectedFamily.complianceStatus as 'red' | 'yellow' | 'green'}
          currentNotes={selectedFamily.managerNotes || ''}
          language={language}
          onSave={handleUpdateFamilyStatus}
        />
      )}

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
