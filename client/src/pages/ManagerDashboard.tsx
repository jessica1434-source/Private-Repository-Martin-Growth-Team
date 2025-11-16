import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChildrenTable from "@/components/ChildrenTable";
import GrowthHistoryDialog from "@/components/GrowthHistoryDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import StatusBadge from "@/components/StatusBadge";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import type { Manager, Family, Child, GrowthRecord } from "@shared/schema";

interface ManagerDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  managerId: string;
}

export default function ManagerDashboard({ 
  language, 
  onLanguageChange, 
  managerId
}: ManagerDashboardProps) {
  const t = useTranslation(language);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');

  const { data: currentManager, isLoading: managerLoading } = useQuery<Manager>({
    queryKey: ['/api/managers', managerId],
  });

  const { data: myFamilies = [], isLoading: familiesLoading } = useQuery<Family[]>({
    queryKey: ['/api/families/manager', managerId],
  });

  const { data: allChildren = [], isLoading: childrenLoading } = useQuery<Child[]>({
    queryKey: ['/api/children'],
  });

  const { data: growthRecords = [], isLoading: recordsLoading } = useQuery<GrowthRecord[]>({
    queryKey: ['/api/growth-records'],
  });

  const isLoading = managerLoading || familiesLoading || childrenLoading || recordsLoading;

  const myFamilyIds = myFamilies.map(f => f.id);
  const myChildren = allChildren.filter(child => 
    myFamilyIds.includes(child.familyId)
  );

  const childrenTableData = myChildren.map(child => {
    const family = myFamilies.find(f => f.id === child.familyId);
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

  const handleViewHistory = (childId: string) => {
    setSelectedChild(childId);
    setHistoryDialogOpen(true);
  };

  const selectedChildData = myChildren.find(c => c.id === selectedChild);
  const selectedChildRecords = growthRecords.filter(r => r.childId === selectedChild);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
          <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.myFamilies}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{t.myFamilies}</h1>
            {currentManager && (
              <p className="text-sm text-muted-foreground">{currentManager.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t.familyStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {myFamilies.map(family => {
                const childrenCount = allChildren.filter(c => c.familyId === family.id).length;
                return (
                  <div 
                    key={family.id} 
                    className="p-5 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-card"
                    data-testid={`card-family-status-${family.id}`}
                  >
                    <h3 className="font-semibold text-lg mb-2">{family.familyName}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{childrenCount} {language === 'zh-TW' ? '位孩子' : 'children'}</span>
                      <span>•</span>
                      <span>{family.country === 'taiwan' ? t.taiwan : 
                             family.country === 'singapore' ? t.singapore :
                             family.country === 'malaysia' ? t.malaysia : t.brunei}</span>
                      <span>•</span>
                      <StatusBadge status={family.complianceStatus as any} language={language} />
                    </div>
                    {family.managerNotes && (
                      <p className="text-sm mt-2 text-muted-foreground">{family.managerNotes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t.records}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChildrenTable
              children={childrenTableData}
              language={language}
              onViewHistory={handleViewHistory}
            />
          </CardContent>
        </Card>
      </main>

      {selectedChildData && (
        <GrowthHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          childName={selectedChildData.name}
          birthday={selectedChildData.birthday}
          records={selectedChildRecords}
          language={language}
        />
      )}
    </div>
  );
}
