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
  currentBoneAge?: number | null;
  currentManagerNotes?: string | null;
  currentRole?: string;
  onSave?: (data: {
    familyId: string;
    familyName: string;
    country: string;
    managerId: string;
    complianceStatus?: string;
    boneAge?: number | null;
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
  currentBoneAge,
  currentManagerNotes,
  currentRole = 'manager',
  onSave,
}: EditFamilyDialogProps) {
  const t = useTranslation(language);
  const [familyName, setFamilyName] = useState(currentFamilyName);
  const [country, setCountry] = useState(currentCountry);
  const [managerId, setManagerId] = useState(currentManagerId);
  const [complianceStatus, setComplianceStatus] = useState(currentComplianceStatus);
  const [boneAge, setBoneAge] = useState(currentBoneAge?.toString() || '');
  const [managerNotes, setManagerNotes] = useState(currentManagerNotes || '');

  const isManager = currentRole === 'manager';

  useEffect(() => {
    if (open) {
      setFamilyName(currentFamilyName);
      setCountry(currentCountry);
      setManagerId(currentManagerId);
      setComplianceStatus(currentComplianceStatus);
      setBoneAge(currentBoneAge?.toString() || '');
      setManagerNotes(currentManagerNotes || '');
    }
  }, [open, currentFamilyName, currentCountry, currentManagerId, currentComplianceStatus, currentBoneAge, currentManagerNotes]);

  const handleSave = () => {
    const basicValidation = familyName && country && managerId;
    const supervisorValidation = !isManager ? complianceStatus : true;
    
    if (basicValidation && supervisorValidation) {
      const saveData: any = {
        familyId,
        familyName,
        country,
        managerId,
        boneAge: boneAge ? parseFloat(boneAge) : null,
      };
      
      if (!isManager) {
        saveData.complianceStatus = complianceStatus;
        saveData.managerNotes = managerNotes || null;
      }
      
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
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-country">
              {language === 'zh-TW' ? '國家' : 'Country'}
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="edit-country" data-testid="select-edit-country">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇國家' : 'Select country'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taiwan">{t.taiwan}</SelectItem>
                <SelectItem value="singapore">{t.singapore}</SelectItem>
                <SelectItem value="malaysia">{t.malaysia}</SelectItem>
                <SelectItem value="brunei">{t.brunei}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-manager">
              {language === 'zh-TW' ? '指派管理師' : 'Assign Manager'}
            </Label>
            <Select value={managerId} onValueChange={setManagerId}>
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

          {!isManager && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="edit-compliance-status">
                  {language === 'zh-TW' ? '合規狀態' : 'Compliance Status'}
                </Label>
                <Select value={complianceStatus} onValueChange={setComplianceStatus}>
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
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="edit-bone-age">
              {language === 'zh-TW' ? '骨齡（歲）' : 'Bone Age (years)'}
            </Label>
            <Input
              id="edit-bone-age"
              type="number"
              step="0.1"
              value={boneAge}
              onChange={(e) => setBoneAge(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：8.5' : 'e.g., 8.5'}
              data-testid="input-edit-bone-age"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!familyName || !country || !managerId || (!isManager && !complianceStatus)}
            data-testid="button-save"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
