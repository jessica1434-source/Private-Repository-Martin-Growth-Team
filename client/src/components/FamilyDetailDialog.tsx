import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import { Calendar, User } from "lucide-react";

interface Child {
  id: string;
  name: string;
  birthday: string;
}

interface GrowthRecord {
  recordDate: string;
  height: number;
  weight: number;
  notes: string;
}

interface FamilyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyName: string;
  country: string;
  managerName: string;
  complianceStatus: 'red' | 'yellow' | 'green';
  managerNotes: string;
  children: Child[];
  childrenRecords: { [childId: string]: GrowthRecord[] };
  language: Language;
}

export default function FamilyDetailDialog({
  open,
  onOpenChange,
  familyName,
  country,
  managerName,
  complianceStatus,
  managerNotes,
  children,
  childrenRecords,
  language,
}: FamilyDetailDialogProps) {
  const t = useTranslation(language);

  const countryName = country === 'taiwan' ? t.taiwan : 
                      country === 'singapore' ? t.singapore :
                      country === 'malaysia' ? t.malaysia : t.brunei;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-family-detail">
        <DialogHeader>
          <DialogTitle>{familyName}</DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '家庭詳細資料' : 'Family Details'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'zh-TW' ? '基本資訊' : 'Basic Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.country}</p>
                  <p className="font-medium">{countryName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.managerName}</p>
                  <p className="font-medium">{managerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.status}</p>
                  <StatusBadge status={complianceStatus} language={language} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalChildren}</p>
                  <p className="font-medium">{children.length}</p>
                </div>
              </div>
              {managerNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.managerNotes}</p>
                  <p className="mt-1">{managerNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'zh-TW' ? '孩子列表' : 'Children List'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {children.map((child) => {
                  const records = childrenRecords[child.id] || [];
                  const latestRecord = records.sort((a, b) => 
                    new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
                  )[0];

                  return (
                    <div 
                      key={child.id} 
                      className="p-4 border rounded-lg space-y-2"
                      data-testid={`child-detail-${child.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">{child.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{language === 'zh-TW' ? '生日：' : 'Birthday: '}{child.birthday}</span>
                      </div>
                      {latestRecord && (
                        <div className="mt-3 pt-3 border-t space-y-1">
                          <p className="text-sm font-medium">
                            {language === 'zh-TW' ? '最新紀錄' : 'Latest Record'}
                            <span className="text-muted-foreground ml-2">
                              ({latestRecord.recordDate})
                            </span>
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                {language === 'zh-TW' ? '身高：' : 'Height: '}
                              </span>
                              <span className="font-mono">{latestRecord.height} cm</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {language === 'zh-TW' ? '體重：' : 'Weight: '}
                              </span>
                              <span className="font-mono">{latestRecord.weight} kg</span>
                            </div>
                          </div>
                          {latestRecord.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {latestRecord.notes}
                            </p>
                          )}
                        </div>
                      )}
                      {!latestRecord && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {language === 'zh-TW' ? '尚無成長紀錄' : 'No growth records yet'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
