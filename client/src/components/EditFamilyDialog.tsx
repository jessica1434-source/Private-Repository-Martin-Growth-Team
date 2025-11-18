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
import { Textarea } from "@/components/ui/textarea";
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
}

interface EditFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  managers: Manager[];
  familyId: string;
  currentFamilyName: string;
  currentCountry: string;
  currentManagerId: string;
  currentComplianceStatus: string;
  currentManagerNotes?: string | null;
  currentRole?: string;
  onSave?: (data: {
    familyId: string;
    familyName: string;
    country: string;
    managerId: string;
    complianceStatus?: string;
    managerNotes?: string | null;
  }) => void;
}

export default function EditFamilyDialog({
  open,
  onOpenChange,
  language,
  managers,
  familyId,
  currentFamilyName,
  currentCountry,
  currentManagerId,
  currentComplianceStatus,
  currentManagerNotes,
  currentRole = 'manager',
  onSave,
}: EditFamilyDialogProps) {
  const t = useTranslation(language);
  const [familyName, setFamilyName] = useState(currentFamilyName);
  const [country, setCountry] = useState(currentCountry);
  const [managerId, setManagerId] = useState(currentManagerId);
  const [complianceStatus, setComplianceStatus] = useState(currentComplianceStatus);
  const [managerNotes, setManagerNotes] = useState(currentManagerNotes || '');

  const isSupervisor = currentRole === 'supervisor';

  useEffect(() => {
    if (open) {
      setFamilyName(currentFamilyName);
      setCountry(currentCountry);
      setManagerId(currentManagerId);
      setComplianceStatus(currentComplianceStatus);
      setManagerNotes(currentManagerNotes || '');
    }
  }, [open, currentFamilyName, currentCountry, currentManagerId, currentComplianceStatus, currentManagerNotes]);

  const handleSave = () => {
    if (isSupervisor) {
      onOpenChange(false);
      return;
    }
    
    const basicValidation = familyName && country && managerId;
    
    if (basicValidation && complianceStatus) {
      const saveData: any = {
        familyId,
        familyName,
        country,
        managerId,
        complianceStatus,
        managerNotes: managerNotes || null,
      };
      
      onSave?.(saveData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-edit-family">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '編輯家庭資料' : 'Edit Family Information'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '修改家庭基本資料和管理師分配' : 'Update family details and manager assignment'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-family-name">
              {language === 'zh-TW' ? '家庭名稱' : 'Family Name'}
            </Label>
            <Input
              id="edit-family-name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：李家' : 'e.g., Lee Family'}
              data-testid="input-edit-family-name"
              disabled={isSupervisor}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-country">
              {language === 'zh-TW' ? '國家' : 'Country'}
            </Label>
            <Input
              id="edit-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：台灣、新加坡、馬來西亞' : 'e.g., Taiwan, Singapore, Malaysia'}
              data-testid="input-edit-country"
              disabled={isSupervisor}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-manager">
              {language === 'zh-TW' ? '指派管理師' : 'Assign Manager'}
            </Label>
            <Select value={managerId} onValueChange={setManagerId} disabled={isSupervisor}>
              <SelectTrigger id="edit-manager" data-testid="select-edit-manager">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇管理師' : 'Select manager'} />
              </SelectTrigger>
              <SelectContent>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-compliance-status">
              {language === 'zh-TW' ? '執行狀況' : 'Execution Status'}
            </Label>
            <Select value={complianceStatus} onValueChange={setComplianceStatus} disabled={isSupervisor}>
              <SelectTrigger id="edit-compliance-status" data-testid="select-edit-compliance-status">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇狀態' : 'Select status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">
                  {language === 'zh-TW' ? '🟢 正常' : '🟢 Normal'}
                </SelectItem>
                <SelectItem value="yellow">
                  {language === 'zh-TW' ? '🟡 注意' : '🟡 Attention'}
                </SelectItem>
                <SelectItem value="red">
                  {language === 'zh-TW' ? '🔴 風險' : '🔴 Risk'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-manager-notes">
              {language === 'zh-TW' ? '執行狀況說明' : 'Execution Notes'}
            </Label>
            <Textarea
              id="edit-manager-notes"
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              placeholder={language === 'zh-TW' ? '記錄執行狀況和注意事項' : 'Record execution status and notes'}
              data-testid="textarea-edit-manager-notes"
              rows={3}
              disabled={isSupervisor}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!familyName || !country || !managerId || !complianceStatus}
            data-testid="button-save"
          >
            {isSupervisor ? (language === 'zh-TW' ? '關閉' : 'Close') : t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
