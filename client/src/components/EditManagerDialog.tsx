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
import { Input } from "@/components/ui/input";
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
import type { Manager } from "@shared/schema";

interface EditManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  currentName: string;
  currentEmail?: string;
  currentRole: string;
  currentSupervisorId?: string | null;
  supervisorOptions?: Manager[];
  onSave?: (data: { name: string; role: string; supervisorId?: string | null }) => void;
}

export default function EditManagerDialog({
  open,
  onOpenChange,
  language,
  currentName,
  currentEmail = '',
  currentRole,
  currentSupervisorId,
  supervisorOptions = [],
  onSave,
}: EditManagerDialogProps) {
  const t = useTranslation(language);
  const [name, setName] = useState(currentName);
  const [role, setRole] = useState(currentRole);
  const [supervisorId, setSupervisorId] = useState<string | null>(currentSupervisorId || null);

  useEffect(() => {
    if (open) {
      setName(currentName);
      setRole(currentRole);
      setSupervisorId(currentSupervisorId || null);
    }
  }, [open, currentName, currentRole, currentSupervisorId]);

  const handleSave = () => {
    if (name && role) {
      onSave?.({ 
        name, 
        role,
        supervisorId: (role === 'manager' || role === 'supervisor') ? supervisorId : null
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-edit-manager">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '編輯管理師' : 'Edit Manager'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '修改管理師的基本資料' : 'Update manager information'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-manager-name">
              {language === 'zh-TW' ? '姓名' : 'Name'}
            </Label>
            <Input
              id="edit-manager-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'zh-TW' ? '輸入管理師姓名' : 'Enter manager name'}
              data-testid="input-edit-manager-name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-manager-role">
              {language === 'zh-TW' ? '角色' : 'Role'}
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="edit-manager-role" data-testid="select-edit-manager-role">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇角色' : 'Select role'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager" data-testid="role-option-manager">
                  {language === 'zh-TW' ? '管理師' : 'Manager'}
                </SelectItem>
                <SelectItem value="supervisor" data-testid="role-option-supervisor">
                  {language === 'zh-TW' ? '主任管理師' : 'Supervisor'}
                </SelectItem>
                <SelectItem value="boss" data-testid="role-option-boss">
                  {language === 'zh-TW' ? '老闆' : 'Boss'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(role === 'manager' || role === 'supervisor') && (
            <div className="grid gap-2">
              <Label htmlFor="edit-manager-supervisor">
                {language === 'zh-TW' ? '上級主管' : 'Supervisor'}
              </Label>
              <Select 
                value={supervisorId || 'none'} 
                onValueChange={(value) => setSupervisorId(value === 'none' ? null : value)}
              >
                <SelectTrigger id="edit-manager-supervisor" data-testid="select-edit-manager-supervisor">
                  <SelectValue placeholder={language === 'zh-TW' ? '選擇上級主管（可選）' : 'Select supervisor (optional)'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" data-testid="supervisor-option-none">
                    {language === 'zh-TW' ? '無上級主管' : 'No supervisor'}
                  </SelectItem>
                  {supervisorOptions.map((supervisor) => (
                    <SelectItem 
                      key={supervisor.id} 
                      value={supervisor.id}
                      data-testid={`supervisor-option-${supervisor.id}`}
                    >
                      {supervisor.name} ({supervisor.username})
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
          <Button onClick={handleSave} disabled={!name || !role} data-testid="button-save">
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
