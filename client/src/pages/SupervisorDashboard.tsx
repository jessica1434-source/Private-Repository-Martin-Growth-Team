import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Baby, Users, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import ChildrenTable from "@/components/ChildrenTable";
import FamilyDetailDialog from "@/components/FamilyDetailDialog";
import EditFamilyDialog from "@/components/EditFamilyDialog";
import EditManagerDialog from "@/components/EditManagerDialog";
import GrowthRecordDialog from "@/components/GrowthRecordDialog";
import GrowthHistoryDialog from "@/components/GrowthHistoryDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families' | 'children'>('overview');
  const [viewFamilyDetailOpen, setViewFamilyDetailOpen] = useState(false);
  const [editFamilyDialogOpen, setEditFamilyDialogOpen] = useState(false);
  const [editManagerDialogOpen, setEditManagerDialogOpen] = useState(false);
  const [growthRecordDialogOpen, setGrowthRecordDialogOpen] = useState(false);
  const [growthHistoryDialogOpen, setGrowthHistoryDialogOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [selectedChildId, setSelectedChildId] = useState<string>('');

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

  const updateFamilyMutation = useMutation({
    mutationFn: async (data: { 
      familyId: string; 
      familyName: string; 
      country: string; 
      managerId: string;
      complianceStatus: string;
      boneAge?: number | null;
    }) => {
      return await apiRequest('PATCH', `/api/families/${data.familyId}`, {
        familyName: data.familyName,
        country: data.country,
        managerId: data.managerId,
        complianceStatus: data.complianceStatus,
        boneAge: data.boneAge,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/families'] });
      queryClient.invalidateQueries({ queryKey: ['/api/families/manager'] });
      toast({
        title: language === 'zh-TW' ? '更新成功' : 'Update Successful',
        description: language === 'zh-TW' ? '家庭資料已更新' : 'Family information has been updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '更新失敗' : 'Update Failed',
        description: error.message || (language === 'zh-TW' ? '無法更新家庭資料' : 'Failed to update family information'),
        variant: 'destructive',
      });
    },
  });

  const deleteFamilyMutation = useMutation({
    mutationFn: async (familyId: string) => {
      return await apiRequest('DELETE', `/api/families/${familyId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/families'] });
      queryClient.invalidateQueries({ queryKey: ['/api/children'] });
      toast({
        title: language === 'zh-TW' ? '刪除成功' : 'Delete Successful',
        description: language === 'zh-TW' ? '家庭已刪除' : 'Family deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '刪除失敗' : 'Delete Failed',
        description: error.message || (language === 'zh-TW' ? '無法刪除家庭' : 'Failed to delete family'),
        variant: 'destructive',
      });
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      return await apiRequest('DELETE', `/api/children/${childId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/children'] });
      queryClient.invalidateQueries({ queryKey: ['/api/growth-records'] });
      toast({
        title: language === 'zh-TW' ? '刪除成功' : 'Delete Successful',
        description: language === 'zh-TW' ? '孩童已刪除' : 'Child deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '刪除失敗' : 'Delete Failed',
        description: error.message || (language === 'zh-TW' ? '無法刪除孩童' : 'Failed to delete child'),
        variant: 'destructive',
      });
    },
  });

  const updateManagerMutation = useMutation({
    mutationFn: async (data: { managerId: string; name: string }) => {
      return await apiRequest('PATCH', `/api/managers/${data.managerId}`, {
        name: data.name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managers/supervisor', supervisorId] });
      toast({
        title: language === 'zh-TW' ? '更新成功' : 'Update Successful',
        description: language === 'zh-TW' ? '管理師資料已更新' : 'Manager information has been updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '更新失敗' : 'Update Failed',
        description: error.message || (language === 'zh-TW' ? '無法更新管理師資料' : 'Failed to update manager information'),
        variant: 'destructive',
      });
    },
  });

  const addRecordMutation = useMutation({
    mutationFn: async (data: { childId: string; date: string; height: number; weight: number; notes: string }) => {
      return await apiRequest('POST', '/api/growth-records', {
        childId: data.childId,
        recordDate: data.date,
        height: data.height,
        weight: data.weight,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/growth-records'] });
      toast({
        title: language === 'zh-TW' ? '新增成功' : 'Record Added',
        description: language === 'zh-TW' ? '成長記錄已新增' : 'Growth record has been added',
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '新增失敗' : 'Addition Failed',
        description: error.message || (language === 'zh-TW' ? '無法新增成長記錄' : 'Failed to add growth record'),
        variant: 'destructive',
      });
    },
  });

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
      username: manager.username,
      familiesCount,
      childrenCount,
    };
  });

  const childrenTableData = subordinateChildren.map(child => {
    const family = subordinateFamilies.find(f => f.id === child.familyId);
    const childRecords = growthRecords.filter(r => r.childId === child.id);
    const latestRecord = childRecords.sort((a, b) => 
      new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    )[0];
    
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

  const handleViewFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setViewFamilyDetailOpen(true);
  };

  const handleEditFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setEditFamilyDialogOpen(true);
  };

  const handleEditManager = (managerId: string) => {
    setSelectedManagerId(managerId);
    setEditManagerDialogOpen(true);
  };

  const handleAddRecord = (childId: string) => {
    setSelectedChildId(childId);
    setGrowthRecordDialogOpen(true);
  };

  const handleViewHistory = (childId: string) => {
    setSelectedChildId(childId);
    setGrowthHistoryDialogOpen(true);
  };

  const handleDeleteFamily = (familyId: string) => {
    const family = allFamilies.find(f => f.id === familyId);
    const confirmMessage = language === 'zh-TW' 
      ? `確定要刪除家庭「${family?.familyName}」嗎？這將同時刪除該家庭的所有孩童和成長記錄。`
      : `Are you sure you want to delete family "${family?.familyName}"? This will also delete all children and growth records in this family.`;
    
    if (window.confirm(confirmMessage)) {
      deleteFamilyMutation.mutate(familyId);
    }
  };

  const handleDeleteChild = (childId: string) => {
    const child = allChildren.find(c => c.id === childId);
    const confirmMessage = language === 'zh-TW' 
      ? `確定要刪除孩童「${child?.name}」嗎？這將同時刪除該孩童的所有成長記錄。`
      : `Are you sure you want to delete child "${child?.name}"? This will also delete all growth records for this child.`;
    
    if (window.confirm(confirmMessage)) {
      deleteChildMutation.mutate(childId);
    }
  };

  const handleSaveFamily = (data: { 
    familyId: string; 
    familyName: string; 
    country: string; 
    managerId: string;
    complianceStatus: string;
    boneAge?: number | null;
  }) => {
    updateFamilyMutation.mutate(data);
  };

  const handleSaveManager = (data: { name: string }) => {
    updateManagerMutation.mutate({
      managerId: selectedManagerId,
      name: data.name,
    });
  };

  const handleSaveRecord = (data: { date: string; height: number; weight: number; notes: string }) => {
    addRecordMutation.mutate({
      childId: selectedChildId,
      ...data,
    });
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
            <h1 className="text-xl md:text-2xl font-bold">{currentSupervisor?.name} - {language === 'zh-TW' ? '主任管理師儀表板' : 'Supervisor Dashboard'}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{language === 'zh-TW' ? '管理旗下團隊' : 'Manage your team'}</p>
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
            {language === 'zh-TW' ? '我的管理師' : 'My Managers'}
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
            {language === 'zh-TW' ? '所有孩子' : 'All Children'}
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
                    onEdit={handleEditManager}
                    onDelete={() => {}}
                    hideActions={false}
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
                    onEdit={handleEditFamily}
                    onDelete={handleDeleteFamily}
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

        {activeTab === 'children' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'zh-TW' ? '所有孩子' : 'All Children'}</CardTitle>
              </CardHeader>
              <CardContent>
                {childrenTableData.length > 0 ? (
                  <ChildrenTable
                    children={childrenTableData}
                    language={language}
                    onAddRecord={handleAddRecord}
                    onViewHistory={handleViewHistory}
                    onDelete={handleDeleteChild}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {language === 'zh-TW' ? '尚無孩子資料' : 'No children yet'}
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

      {selectedFamily && (
        <EditFamilyDialog
          open={editFamilyDialogOpen}
          onOpenChange={setEditFamilyDialogOpen}
          language={language}
          managers={subordinateManagers}
          familyId={selectedFamily.id}
          currentFamilyName={selectedFamily.familyName}
          currentCountry={selectedFamily.country}
          currentManagerId={selectedFamily.managerId || ''}
          currentComplianceStatus={selectedFamily.complianceStatus}
          currentBoneAge={selectedFamily.boneAge}
          onSave={handleSaveFamily}
        />
      )}

      {selectedManagerId && (() => {
        const selectedManager = subordinateManagers.find(m => m.id === selectedManagerId);
        return selectedManager ? (
          <EditManagerDialog
            open={editManagerDialogOpen}
            onOpenChange={setEditManagerDialogOpen}
            language={language}
            currentName={selectedManager.name}
            currentEmail=""
            onSave={handleSaveManager}
          />
        ) : null;
      })()}

      {selectedChildId && (() => {
        const selectedChild = allChildren.find(c => c.id === selectedChildId);
        return selectedChild ? (
          <>
            <GrowthRecordDialog
              open={growthRecordDialogOpen}
              onOpenChange={setGrowthRecordDialogOpen}
              childName={selectedChild.name}
              language={language}
              onSave={handleSaveRecord}
            />
            <GrowthHistoryDialog
              open={growthHistoryDialogOpen}
              onOpenChange={setGrowthHistoryDialogOpen}
              childName={selectedChild.name}
              birthday={selectedChild.birthday}
              records={growthRecords.filter(r => r.childId === selectedChildId)}
              language={language}
            />
          </>
        ) : null;
      })()}
    </div>
  );
}
