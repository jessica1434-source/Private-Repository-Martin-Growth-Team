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

interface AddFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  managers: Manager[];
  onSave?: (data: {
    familyName: string;
    country: string;
    managerId: string;
    complianceStatus: string;
    boneAge?: number | null;
  }) => void;
}

export default function AddFamilyDialog({
  open,
  onOpenChange,
  language,
  managers,
  onSave,
}: AddFamilyDialogProps) {
  const t = useTranslation(language);
  const [familyName, setFamilyName] = useState("");
  const [country, setCountry] = useState("");
  const [managerId, setManagerId] = useState("");
  const [complianceStatus, setComplianceStatus] = useState("green");
  const [boneAge, setBoneAge] = useState("");

  useEffect(() => {
    if (open) {
      setFamilyName("");
      setCountry("");
      setManagerId("");
      setComplianceStatus("green");
      setBoneAge("");
    }
  }, [open]);

  const handleSave = () => {
    if (familyName && country && managerId) {
      onSave?.({
        familyName,
        country,
        managerId,
        complianceStatus,
        boneAge: boneAge ? parseFloat(boneAge) : null,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-add-family">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '新增家庭' : 'Add Family'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '建立新的家庭資料並指派管理師' : 'Create new family and assign manager'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-family-name">
              {language === 'zh-TW' ? '家庭名稱' : 'Family Name'}
            </Label>
            <Input
              id="add-family-name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：李家' : 'e.g., Lee Family'}
              data-testid="input-add-family-name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-country">
              {language === 'zh-TW' ? '國家' : 'Country'}
            </Label>
            <Input
              id="add-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：台灣、新加坡、馬來西亞' : 'e.g., Taiwan, Singapore, Malaysia'}
              data-testid="input-add-country"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-manager">
              {language === 'zh-TW' ? '指派管理師' : 'Assign Manager'}
            </Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger id="add-manager" data-testid="select-add-manager">
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
            <Label htmlFor="add-compliance-status">
              {language === 'zh-TW' ? '合規狀態' : 'Compliance Status'}
            </Label>
            <Select value={complianceStatus} onValueChange={setComplianceStatus}>
              <SelectTrigger id="add-compliance-status" data-testid="select-add-compliance-status">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇狀態' : 'Select status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">
                  {language === 'zh-TW' ? '正常' : 'Normal'}
                </SelectItem>
                <SelectItem value="yellow">
                  {language === 'zh-TW' ? '注意' : 'Attention'}
                </SelectItem>
                <SelectItem value="red">
                  {language === 'zh-TW' ? '風險' : 'Risk'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-bone-age">
              {language === 'zh-TW' ? '骨齡（歲）' : 'Bone Age (years)'}
            </Label>
            <Input
              id="add-bone-age"
              type="number"
              step="0.1"
              value={boneAge}
              onChange={(e) => setBoneAge(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：8.5（選填）' : 'e.g., 8.5 (optional)'}
              data-testid="input-add-bone-age"
            />
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
