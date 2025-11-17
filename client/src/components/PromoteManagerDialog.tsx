import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface Manager {
  id: string;
  name: string;
  role: string;
}

interface PromoteManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  managerId: string;
  currentName: string;
  currentRole: string;
  currentSupervisorId?: string | null;
  managers?: Manager[];
  onSave?: (data: {
    managerId: string;
    newRole: string;
    supervisorId?: string | null;
  }) => void;
}

export default function PromoteManagerDialog({
  open,
  onOpenChange,
  language,
  managerId,
  currentName,
  currentRole,
  currentSupervisorId,
  managers = [],
  onSave,
}: PromoteManagerDialogProps) {
  const t = useTranslation(language);
  const [newRole, setNewRole] = useState(currentRole);
  const [supervisorId, setSupervisorId] = useState<string>(currentSupervisorId || '');

  useEffect(() => {
    if (open) {
      setNewRole(currentRole);
      setSupervisorId(currentSupervisorId || '');
    }
  }, [open, currentRole, currentSupervisorId]);

  const handleSave = () => {
    if (newRole) {
      onSave?.({
        managerId,
        newRole,
        supervisorId: supervisorId || null,
      });
      onOpenChange(false);
    }
  };

  const availableSupervisors = managers.filter(m => 
    m.role === 'supervisor' && m.id !== managerId
  );

  const showSupervisorSelect = newRole === 'manager' || newRole === 'supervisor';

  const roleLabel = (role: string) => {
    switch (role) {
      case 'boss':
        return language === 'zh-TW' ? '總經理' : 'Boss';
      case 'supervisor':
        return language === 'zh-TW' ? '主任管理師' : 'Supervisor';
      case 'manager':
        return language === 'zh-TW' ? '管理師' : 'Manager';
      default:
        return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-promote-manager">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '調整管理師權限' : 'Adjust Manager Role'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? `為 ${currentName} 設定新的角色權限` : `Set new role for ${currentName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current-role">
              {language === 'zh-TW' ? '目前角色' : 'Current Role'}
            </Label>
            <div className="text-sm font-medium px-3 py-2 bg-muted rounded-md">
              {roleLabel(currentRole)}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-role">
              {language === 'zh-TW' ? '新角色' : 'New Role'}
            </Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger id="new-role" data-testid="select-new-role">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇角色' : 'Select role'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">
                  {language === 'zh-TW' ? '管理師' : 'Manager'}
                </SelectItem>
                <SelectItem value="supervisor">
                  {language === 'zh-TW' ? '主任管理師' : 'Supervisor'}
                </SelectItem>
                <SelectItem value="boss">
                  {language === 'zh-TW' ? '總經理' : 'Boss'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showSupervisorSelect && (
            <div className="grid gap-2">
              <Label htmlFor="supervisor">
                {language === 'zh-TW' ? '指派主任管理師' : 'Assign Supervisor'}
              </Label>
              <Select value={supervisorId} onValueChange={setSupervisorId}>
                <SelectTrigger id="supervisor" data-testid="select-supervisor">
                  <SelectValue placeholder={language === 'zh-TW' ? '選擇主任管理師（可選）' : 'Select supervisor (optional)'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {language === 'zh-TW' ? '無' : 'None'}
                  </SelectItem>
                  {availableSupervisors.map(supervisor => (
                    <SelectItem key={supervisor.id} value={supervisor.id}>
                      {supervisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!newRole}
            data-testid="button-save"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
