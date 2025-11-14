import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface ChildData {
  id: string;
  name: string;
  birthday: string;
  familyName: string;
  lastHeight?: number;
  lastWeight?: number;
  lastRecordDate?: string;
}

interface ChildrenTableProps {
  children: ChildData[];
  language: Language;
  onAddRecord?: (childId: string) => void;
  onViewHistory?: (childId: string) => void;
}

export default function ChildrenTable({ children, language, onAddRecord, onViewHistory }: ChildrenTableProps) {
  const t = useTranslation(language);

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const years = differenceInYears(new Date(), birthDate);
    const months = differenceInMonths(new Date(), birthDate) % 12;
    
    if (years === 0) {
      return `${months} ${t.months}`;
    }
    return `${years} ${t.years}`;
  };

  return (
    <div className="rounded-md border" data-testid="table-children">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.childName}</TableHead>
            <TableHead>{t.familyName}</TableHead>
            <TableHead>{t.age}</TableHead>
            <TableHead>{t.height} ({t.cm})</TableHead>
            <TableHead>{t.weight} ({t.kg})</TableHead>
            <TableHead>{t.lastRecord}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => (
            <TableRow key={child.id} data-testid={`row-child-${child.id}`}>
              <TableCell className="font-medium">{child.name}</TableCell>
              <TableCell>{child.familyName}</TableCell>
              <TableCell>{calculateAge(child.birthday)}</TableCell>
              <TableCell className="font-mono">
                {child.lastHeight ? child.lastHeight.toFixed(1) : '-'}
              </TableCell>
              <TableCell className="font-mono">
                {child.lastWeight ? child.lastWeight.toFixed(1) : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {child.lastRecordDate ? format(new Date(child.lastRecordDate), 'yyyy/MM/dd') : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onViewHistory?.(child.id)}
                    data-testid={`button-history-${child.id}`}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onAddRecord?.(child.id)}
                    data-testid={`button-add-record-${child.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
