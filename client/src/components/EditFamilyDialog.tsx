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
  onSave?: (data: {
    familyId: string;
    familyName: string;
    country: string;
    managerId: string;
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
  onSave,
}: EditFamilyDialogProps) {
  const t = useTranslation(language);
  const [familyName, setFamilyName] = useState(currentFamilyName);
  const [country, setCountry] = useState(currentCountry);
  const [managerId, setManagerId] = useState(currentManagerId);

  useEffect(() => {
    if (open) {
      setFamilyName(currentFamilyName);
      setCountry(currentCountry);
      setManagerId(currentManagerId);
    }
  }, [open, currentFamilyName, currentCountry, currentManagerId]);

  const handleSave = () => {
    if (familyName && country && managerId) {
      onSave?.({
        familyId,
        familyName,
        country,
        managerId,
      });
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!familyName || !country || !managerId}
            data-testid="button-save"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
