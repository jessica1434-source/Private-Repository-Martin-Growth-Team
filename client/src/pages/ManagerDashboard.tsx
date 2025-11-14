import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChildrenTable from "@/components/ChildrenTable";
import GrowthRecordDialog from "@/components/GrowthRecordDialog";
import FamilyStatusDialog from "@/components/FamilyStatusDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import StatusBadge from "@/components/StatusBadge";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface Manager {
  id: string;
  name: string;
  email: string;
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

interface ManagerDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  managerId: string;
  onBack: () => void;
  managers: Manager[];
  families: Family[];
  setFamilies: (families: Family[]) => void;
  children: Child[];
  growthRecords: GrowthRecord[];
  setGrowthRecords: (records: GrowthRecord[]) => void;
}

export default function ManagerDashboard({ 
  language, 
  onLanguageChange, 
  managerId, 
  onBack,
  managers,
  families,
  setFamilies,
  children,
  growthRecords,
  setGrowthRecords
}: ManagerDashboardProps) {
  const t = useTranslation(language);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  
  const currentManager = managers.find(m => m.id === managerId);

  const myFamilies = families.filter(f => f.managerId === managerId);
  const myChildren = children.filter(child => 
    myFamilies.some(f => f.id === child.familyId)
  );

  const childrenTableData = myChildren.map(child => {
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

  const handleAddRecord = (childId: string) => {
    setSelectedChild(childId);
    setRecordDialogOpen(true);
  };

  const handleSaveGrowthRecord = (data: { date: string; height: number; weight: number; notes: string }) => {
    const newRecord = {
      id: `r${growthRecords.length + 1}`,
      childId: selectedChild,
      recordDate: data.date,
      height: data.height,
      weight: data.weight,
      notes: data.notes,
    };
    setGrowthRecords([...growthRecords, newRecord]);
  };

  const handleUpdateStatus = (familyId: string) => {
    setSelectedFamily(familyId);
    setStatusDialogOpen(true);
  };

  const handleSaveFamilyStatus = (data: { status: 'red' | 'yellow' | 'green'; notes: string }) => {
    setFamilies(families.map(f => 
      f.id === selectedFamily 
        ? { ...f, complianceStatus: data.status, managerNotes: data.notes }
        : f
    ));
  };

  const selectedChildData = myChildren.find(c => c.id === selectedChild);
  const selectedFamilyData = myFamilies.find(f => f.id === selectedFamily);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">{t.myFamilies}</h1>
              {currentManager && (
                <p className="text-sm text-muted-foreground">{currentManager.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.familyStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {myFamilies.map(family => {
                const childrenCount = children.filter(c => c.familyId === family.id).length;
                return (
                  <div 
                    key={family.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                    data-testid={`card-family-status-${family.id}`}
                  >
                    <div className="flex-1">
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
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateStatus(family.id)}
                      data-testid={`button-update-status-${family.id}`}
                    >
                      {t.updateStatus}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{t.records}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChildrenTable
              children={childrenTableData}
              language={language}
              onAddRecord={handleAddRecord}
              onViewHistory={(id) => console.log('View history for:', id)}
            />
          </CardContent>
        </Card>
      </main>

      <GrowthRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        childName={selectedChildData?.name || ''}
        language={language}
        onSave={handleSaveGrowthRecord}
      />

      {selectedFamilyData && (
        <FamilyStatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          familyName={selectedFamilyData.familyName}
          currentStatus={selectedFamilyData.complianceStatus as any}
          currentNotes={selectedFamilyData.managerNotes || ''}
          language={language}
          onSave={handleSaveFamilyStatus}
        />
      )}
    </div>
  );
}
