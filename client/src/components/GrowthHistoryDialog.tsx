import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Language } from "@/lib/i18n";

interface GrowthRecord {
  id: string;
  recordDate: string;
  height: number;
  weight: number;
  notes: string;
}

interface GrowthHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
  birthday: string;
  records: GrowthRecord[];
  language: Language;
}

export default function GrowthHistoryDialog({
  open,
  onOpenChange,
  childName,
  birthday,
  records,
  language,
}: GrowthHistoryDialogProps) {
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  const calculateGrowth = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    return current - previous;
  };

  const renderGrowthIndicator = (growth: number | null) => {
    if (growth === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (growth > 0) return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="h-4 w-4" />
        <span className="font-mono text-sm">+{growth.toFixed(1)}</span>
      </div>
    );
    if (growth < 0) return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="h-4 w-4" />
        <span className="font-mono text-sm">{growth.toFixed(1)}</span>
      </div>
    );
    return <span className="text-muted-foreground">-</span>;
  };

  const totalHeightGrowth = sortedRecords.length >= 2
    ? sortedRecords[0].height - sortedRecords[sortedRecords.length - 1].height
    : 0;

  const totalWeightGrowth = sortedRecords.length >= 2
    ? sortedRecords[0].weight - sortedRecords[sortedRecords.length - 1].weight
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-growth-history">
        <DialogHeader>
          <DialogTitle>{childName} - {language === 'zh-TW' ? '成長歷程' : 'Growth History'}</DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '生日：' : 'Birthday: '}{birthday}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {sortedRecords.length >= 2 && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'zh-TW' ? '總身高增長' : 'Total Height Growth'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{totalHeightGrowth.toFixed(1)}</span>
                    <span className="text-muted-foreground">cm</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'zh-TW' ? '首次至最新紀錄' : 'First to latest record'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'zh-TW' ? '總體重增長' : 'Total Weight Growth'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{totalWeightGrowth.toFixed(1)}</span>
                    <span className="text-muted-foreground">kg</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'zh-TW' ? '首次至最新紀錄' : 'First to latest record'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'zh-TW' ? '紀錄日期' : 'Record Date'}</TableHead>
                  <TableHead className="text-right">{language === 'zh-TW' ? '身高 (cm)' : 'Height (cm)'}</TableHead>
                  <TableHead className="text-right">{language === 'zh-TW' ? '身高增長' : 'Height Growth'}</TableHead>
                  <TableHead className="text-right">{language === 'zh-TW' ? '體重 (kg)' : 'Weight (kg)'}</TableHead>
                  <TableHead className="text-right">{language === 'zh-TW' ? '體重增長' : 'Weight Growth'}</TableHead>
                  <TableHead>{language === 'zh-TW' ? '備註' : 'Notes'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {language === 'zh-TW' ? '尚無成長紀錄' : 'No growth records yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRecords.map((record, index) => {
                    const previousRecord = sortedRecords[index + 1];
                    const heightGrowth = calculateGrowth(record.height, previousRecord?.height);
                    const weightGrowth = calculateGrowth(record.weight, previousRecord?.weight);

                    return (
                      <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                        <TableCell className="font-medium">{record.recordDate}</TableCell>
                        <TableCell className="text-right font-mono">{record.height.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          {renderGrowthIndicator(heightGrowth)}
                        </TableCell>
                        <TableCell className="text-right font-mono">{record.weight.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          {renderGrowthIndicator(weightGrowth)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {record.notes || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
