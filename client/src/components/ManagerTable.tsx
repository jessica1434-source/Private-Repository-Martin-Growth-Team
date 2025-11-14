import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Language } from "@/lib/i18n";

interface ManagerData {
  id: string;
  name: string;
  email: string;
  familiesCount: number;
  childrenCount: number;
}

interface ManagerTableProps {
  managers: ManagerData[];
  language: Language;
  onEdit?: (managerId: string) => void;
  onDelete?: (managerId: string) => void;
}

export default function ManagerTable({ managers, language, onEdit, onDelete }: ManagerTableProps) {
  return (
    <div className="rounded-md border" data-testid="table-managers">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'zh-TW' ? '姓名' : 'Name'}</TableHead>
            <TableHead>{language === 'zh-TW' ? '電子郵件' : 'Email'}</TableHead>
            <TableHead>{language === 'zh-TW' ? '負責家庭數' : 'Families'}</TableHead>
            <TableHead>{language === 'zh-TW' ? '負責孩子數' : 'Children'}</TableHead>
            <TableHead className="text-right">{language === 'zh-TW' ? '操作' : 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers.map((manager) => (
            <TableRow key={manager.id} data-testid={`row-manager-${manager.id}`}>
              <TableCell className="font-medium">{manager.name}</TableCell>
              <TableCell className="text-muted-foreground">{manager.email}</TableCell>
              <TableCell className="font-mono">{manager.familiesCount}</TableCell>
              <TableCell className="font-mono">{manager.childrenCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit?.(manager.id)}
                    data-testid={`button-edit-${manager.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete?.(manager.id)}
                    data-testid={`button-delete-${manager.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
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
