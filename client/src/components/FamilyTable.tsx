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
import { Eye, Edit } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface FamilyData {
  id: string;
  familyName: string;
  country: string;
  managerName: string;
  childrenCount: number;
  complianceStatus: 'red' | 'yellow' | 'green';
  notes: string;
}

interface FamilyTableProps {
  families: FamilyData[];
  language: Language;
  onView?: (familyId: string) => void;
  onEdit?: (familyId: string) => void;
}

export default function FamilyTable({ families, language, onView, onEdit }: FamilyTableProps) {
  const t = useTranslation(language);

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
              <TableCell>{family.managerName}</TableCell>
              <TableCell className="font-mono">{family.childrenCount}</TableCell>
              <TableCell>
                <StatusBadge status={family.complianceStatus} language={language} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onView?.(family.id)}
                    data-testid={`button-view-${family.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit?.(family.id)}
                    data-testid={`button-edit-${family.id}`}
                  >
                    <Edit className="h-4 w-4" />
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
