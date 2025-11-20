import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Baby, Users, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/PerformanceChart";
import TrendChart from "@/components/TrendChart";
import BirthdayCard from "@/components/BirthdayCard";
import FamilyTable from "@/components/FamilyTable";
import ManagerTable from "@/components/ManagerTable";
import ChildrenTable from "@/components/ChildrenTable";
import FamilyDetailDialog from "@/components/FamilyDetailDialog";
import GrowthHistoryDialog from "@/components/GrowthHistoryDialog";
import EditManagerDialog from "@/components/EditManagerDialog";
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
  const { manager: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'families' | 'children'>('overview');
  const [viewFamilyDetailOpen, setViewFamilyDetailOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [editManagerDialogOpen, setEditManagerDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; familiesCount: number } | null>(null);

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

  // Fetch growth trends by country from API
  const { data: trendData = {}, isLoading: trendsLoading } = useQuery<Record<string, Array<{ month: string; height: number; weight: number }>>>({
    queryKey: ['/api/analytics/growth-trends-by-country'],
  });

  const isLoading = managersLoading || familiesLoading || childrenLoading || recordsLoading || trendsLoading;

  const totalChildren = children.length;
  const totalManagers = managers.length;
  const highRiskFamilies = families.filter(f => f.complianceStatus === 'red').length;
  const stableFamilies = families.filter(f => f.complianceStatus === 'green').length;

  const performanceData = [
    { name: '陳美玲', height: 2.3 },
    { name: '林志明', height: 1.9 },
    { name: '王小華', height: 2.5 },
    { name: '張雅婷', height: 2.1 },
  ];

  const upcomingBirthdays = children
    .slice(0, 5)
    .sort((a, b) => new Date(a.birthday).getMonth() - new Date(b.birthday).getMonth());

  const familyTableData = families.map(family => {
    const manager = managers.find(m => m.id === family.managerId);
    const supervisor = manager?.supervisorId ? managers.find(m => m.id === manager.supervisorId) : null;
    const childrenCount = children.filter(c => c.familyId === family.id).length;
    return {
      id: family.id,
      familyName: family.familyName,
      country: family.country,
      managerName: manager?.name || '-',
      managerRole: manager?.role,
      supervisorName: supervisor?.name,
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

  const handleViewFamily = (familyId: string) => {
    setSelectedFamilyId(familyId);
    setViewFamilyDetailOpen(true);
  };

  const handleViewHistory = (childId: string) => {
    setSelectedChildId(childId);
    setHistoryDialogOpen(true);
  };

  const editManagerMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; role: Manager['role']; supervisorId?: Manager['supervisorId'] }) => {
      return await apiRequest('PATCH', `/api/managers/${data.id}`, { 
        name: data.name,
        role: data.role,
        supervisorId: data.supervisorId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managers'] });
      toast({
        title: language === 'zh-TW' ? '更新成功' : 'Manager Updated',
        description: language === 'zh-TW' ? '管理師資料已更新' : 'Manager information has been updated successfully',
      });
      setEditManagerDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: language === 'zh-TW' ? '更新失敗' : 'Update Failed',
        description: language === 'zh-TW' ? '無法更新管理師資料' : 'Failed to update manager information',
        variant: 'destructive',
      });
    },
  });

  const deleteManagerMutation = useMutation({
    mutationFn: async (managerId: string) => {
      return await apiRequest('DELETE', `/api/managers/${managerId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managers'] });
      toast({
        title: language === 'zh-TW' ? '刪除成功' : 'Manager Deleted',
        description: language === 'zh-TW' ? '管理師已刪除' : 'Manager has been deleted successfully',
      });
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    },
    onError: (error: any) => {
      const errorMessage = error.message || (language === 'zh-TW' ? '無法刪除管理師' : 'Failed to delete manager');
      toast({
        title: language === 'zh-TW' ? '刪除失敗' : 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleEditManager = (managerId: string) => {
    setSelectedManagerId(managerId);
    setEditManagerDialogOpen(true);
  };

  const handleDeleteClick = (managerId: string) => {
    const manager = managerTableData.find(m => m.id === managerId);
    if (manager) {
      setDeleteTarget({ id: managerId, name: manager.name, familiesCount: manager.familiesCount });
      setDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteManagerMutation.mutate(deleteTarget.id);
  };

  const handleSaveManager = (data: { name: string; role: Manager['role']; supervisorId?: Manager['supervisorId'] }) => {
    if (selectedManagerId) {
      editManagerMutation.mutate({ 
        id: selectedManagerId, 
        name: data.name,
        role: data.role,
        supervisorId: data.supervisorId
      });
    }
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
      boneAge: child.boneAge,
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
                  onDelete={handleDeleteClick}
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

      {selectedManagerId && (() => {
        const selectedManager = managers.find(m => m.id === selectedManagerId);
        // Filter to only boss and supervisor roles, excluding the manager being edited
        const supervisorOptions = managers.filter(m => 
          (m.role === 'boss' || m.role === 'supervisor') && m.id !== selectedManagerId
        );
        const isSelf = currentUser?.id === selectedManagerId;
        return selectedManager ? (
          <EditManagerDialog
            open={editManagerDialogOpen}
            onOpenChange={setEditManagerDialogOpen}
            language={language}
            currentName={selectedManager.name}
            currentEmail={selectedManager.username}
            currentRole={selectedManager.role}
            currentSupervisorId={selectedManager.supervisorId}
            supervisorOptions={supervisorOptions}
            isSelf={isSelf}
            onSave={handleSaveManager}
          />
        ) : null;
      })()}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'zh-TW' ? '確認刪除管理師' : 'Confirm Delete Manager'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'zh-TW' 
                ? `確定要刪除管理師「${deleteTarget?.name}」嗎？此操作無法復原。`
                : `Are you sure you want to delete manager "${deleteTarget?.name}"? This action cannot be undone.`}
              {deleteTarget && deleteTarget.familiesCount > 0 && (
                <p className="mt-2 font-semibold text-destructive">
                  {language === 'zh-TW' 
                    ? `無法刪除有 ${deleteTarget.familiesCount} 個家庭的管理師。請先刪除或重新分配家庭。`
                    : `Cannot delete manager with ${deleteTarget.familiesCount} families. Please delete or reassign families first.`}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              {language === 'zh-TW' ? '取消' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTarget ? deleteTarget.familiesCount > 0 : false}
              data-testid="button-confirm-delete"
            >
              {language === 'zh-TW' ? '刪除' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
