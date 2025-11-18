import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Baby, Users, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import TrendChart from "@/components/TrendChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import ChildrenTable from "@/components/ChildrenTable";
import FamilyDetailDialog from "@/components/FamilyDetailDialog";
import PromoteManagerDialog from "@/components/PromoteManagerDialog";
import GrowthHistoryDialog from "@/components/GrowthHistoryDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import type { Manager, Family, Child, GrowthRecord } from "@shared/schema";

interface BossDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBackToRoleSelection?: () => void;
  onLogout?: () => void;
}

export default function BossDashboard({ 
  language, 
  onLanguageChange,
  onBackToRoleSelection,
  onLogout
}: BossDashboardProps) {
  const t = useTranslation(language);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families' | 'children'>('overview');
  const [viewFamilyDetailOpen, setViewFamilyDetailOpen] = useState(false);
  const [promoteManagerDialogOpen, setPromoteManagerDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  const { data: managers = [], isLoading: managersLoading } = useQuery<Manager[]>({
    queryKey: ['/api/managers'],
  });

  const { data: families = [], isLoading: familiesLoading } = useQuery<Family[]>({
    queryKey: ['/api/families'],
  });

  const { data: children = [], isLoading: childrenLoading } = useQuery<Child[]>({
    queryKey: ['/api/children'],
  });

  const { data: growthRecords = [], isLoading: recordsLoading } = useQuery<GrowthRecord[]>({
    queryKey: ['/api/growth-records'],
  });

  const isLoading = managersLoading || familiesLoading || childrenLoading || recordsLoading;

  const totalChildren = children.length;
  const totalManagers = managers.length;
  const highRiskFamilies = families.filter(f => f.complianceStatus === 'red').length;
  const stableFamilies = families.filter(f => f.complianceStatus === 'green').length;

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

  const upcomingBirthdays = children
    .slice(0, 5)
    .sort((a, b) => new Date(a.birthday).getMonth() - new Date(b.birthday).getMonth());

  const familyTableData = families.map(family => {
    const manager = managers.find(m => m.id === family.managerId);
    const childrenCount = children.filter(c => c.familyId === family.id).length;
    return {
      id: family.id,
      familyName: family.familyName,
      country: family.country,
      managerName: manager?.name || '-',
      childrenCount,
      complianceStatus: family.complianceStatus as 'red' | 'yellow' | 'green',
      notes: family.managerNotes || '',
    };
  });

  const managerTableData = managers.map(manager => {
    const familiesCount = families.filter(f => f.managerId === manager.id).length;
    const childrenCount = children.filter(c => 
      families.some(f => f.id === c.familyId && f.managerId === manager.id)
    ).length;
    return {
      id: manager.id,
      name: manager.name,
      username: manager.username,
      familiesCount,
      childrenCount,
    };
  });

  const updateManagerMutation = useMutation({
    mutationFn: async (data: { managerId: string; newRole: string; supervisorId?: string | null }) => {
      await apiRequest('PATCH', `/api/managers/${data.managerId}`, {
        role: data.newRole,
        supervisorId: data.supervisorId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managers'] });
      toast({
        title: language === 'zh-TW' ? '更新成功' : 'Update Successful',
        description: language === 'zh-TW' ? '管理師角色已更新' : 'Manager role updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'zh-TW' ? '更新失敗' : 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleViewFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setViewFamilyDetailOpen(true);
  };

  const handleEditManager = (managerId: string) => {
    setSelectedManagerId(managerId);
    setPromoteManagerDialogOpen(true);
  };

  const handleViewHistory = (childId: string) => {
    setSelectedChildId(childId);
    setHistoryDialogOpen(true);
  };

  const childrenTableData = children.map(child => {
    const family = families.find(f => f.id === child.familyId);
    const latestRecord = growthRecords
      .filter(r => r.childId === child.id)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())[0];

    return {
      id: child.id,
      name: child.name,
      birthday: child.birthday,
      familyName: family?.familyName || '-',
      lastHeight: latestRecord?.height,
      lastWeight: latestRecord?.weight,
      lastRecordDate: latestRecord?.recordDate,
    };
  });

  const selectedFamily = families.find(f => f.id === selectedFamilyId);
  const selectedFamilyChildren = children.filter(c => c.familyId === selectedFamilyId);
  const selectedFamilyRecords = selectedFamilyChildren.reduce((acc, child) => {
    acc[child.id] = growthRecords.filter(r => r.childId === child.id);
    return acc;
  }, {} as { [childId: string]: typeof growthRecords });
  const selectedFamilyManager = managers.find(m => m.id === selectedFamily?.managerId);

  const selectedManager = managers.find(m => m.id === selectedManagerId);
  const selectedChild = children.find(c => c.id === selectedChildId);
  const selectedChildRecords = growthRecords.filter(r => r.childId === selectedChildId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
          <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.dashboard}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '總覽管理控制台' : 'Management Overview'}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
              <ThemeToggle />
              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  登出
                </Button>
              )}
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
            <h1 className="text-xl md:text-2xl font-bold">{t.dashboard}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '總覽管理控制台' : 'Management Overview'}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            )}
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
            {language === 'zh-TW' ? '管理師管理' : 'Managers'}
          </Button>
          <Button 
            variant={activeTab === 'families' ? 'default' : 'outline'}
            onClick={() => setActiveTab('families')}
            data-testid="button-tab-families"
          >
            {t.families}
          </Button>
          <Button 
            variant={activeTab === 'children' ? 'default' : 'outline'}
            onClick={() => setActiveTab('children')}
            data-testid="button-tab-children"
          >
            {language === 'zh-TW' ? '孩童管理' : 'Children'}
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                description={language === 'zh-TW' ? `平均負責 ${Math.round(families.length / totalManagers)} 個家庭` : `Avg ${Math.round(families.length / totalManagers)} families each`}
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
              <CardHeader>
                <CardTitle>{language === 'zh-TW' ? '管理師名單' : 'Manager List'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ManagerTable
                  managers={managerTableData}
                  language={language}
                  onEdit={handleEditManager}
                />
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
                <FamilyTable
                  families={familyTableData}
                  language={language}
                  onView={handleViewFamily}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'zh-TW' ? '孩童名單' : 'Children List'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChildrenTable
                  children={childrenTableData}
                  language={language}
                  onViewHistory={handleViewHistory}
                />
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

      {selectedManager && (
        <PromoteManagerDialog
          open={promoteManagerDialogOpen}
          onOpenChange={setPromoteManagerDialogOpen}
          language={language}
          managerId={selectedManager.id}
          currentName={selectedManager.name}
          currentRole={selectedManager.role}
          currentSupervisorId={selectedManager.supervisorId}
          managers={managers}
          onSave={(data) => updateManagerMutation.mutate(data)}
        />
      )}

      {selectedChild && (
        <GrowthHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          childName={selectedChild.name}
          birthday={selectedChild.birthday}
          records={selectedChildRecords}
          language={language}
        />
      )}
    </div>
  );
}
