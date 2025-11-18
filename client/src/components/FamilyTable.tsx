import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface FamilyData {
  id: string;
  familyName: string;
  country: string;
  managerName: string;
  managerRole?: string;
  childrenCount: number;
  complianceStatus: 'red' | 'yellow' | 'green';
  notes: string;
}

interface FamilyTableProps {
  families: FamilyData[];
  language: Language;
  onView?: (familyId: string) => void;
  onEdit?: (familyId: string) => void;
  onDelete?: (familyId: string) => void;
}

export default function FamilyTable({ families, language, onView, onEdit, onDelete }: FamilyTableProps) {
  const t = useTranslation(language);

  const getRoleText = (role?: string) => {
    if (!role) return '';
    if (role === 'supervisor') {
      return language === 'zh-TW' ? '主任管理師' : 'Supervisor';
    }
    if (role === 'manager') {
      return language === 'zh-TW' ? '管理師' : 'Manager';
    }
    return '';
  };

  return (
    <div className="rounded-md border" data-testid="table-families">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.familyName}</TableHead>
            <TableHead>{t.country}</TableHead>
            <TableHead>{t.managerName}</TableHead>
            <TableHead>{t.totalChildren}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {families.map((family) => (
            <TableRow key={family.id} data-testid={`row-family-${family.id}`}>
              <TableCell className="font-medium">{family.familyName}</TableCell>
              <TableCell>{family.country}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span>{family.managerName}</span>
                  {family.managerRole && (
                    <span className="text-xs text-muted-foreground" data-testid={`manager-role-${family.id}`}>
                      {getRoleText(family.managerRole)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono">{family.childrenCount}</TableCell>
              <TableCell>
                <StatusBadge status={family.complianceStatus} language={language} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onView(family.id)}
                      data-testid={`button-view-${family.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEdit(family.id)}
                      data-testid={`button-edit-${family.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDelete(family.id)}
                      data-testid={`button-delete-${family.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
