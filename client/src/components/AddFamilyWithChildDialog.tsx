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
import { Separator } from "@/components/ui/separator";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface AddFamilyWithChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  managerId: string;
  onSave?: (data: {
    family: {
      familyName: string;
      country: string;
      managerId: string;
      complianceStatus: string;
    };
    child: {
      name: string;
      birthday: string;
      boneAge?: number | null;
    };
  }) => void;
  isPending?: boolean;
}

export default function AddFamilyWithChildDialog({
  open,
  onOpenChange,
  language,
  managerId,
  onSave,
  isPending = false,
}: AddFamilyWithChildDialogProps) {
  const t = useTranslation(language);
  const [familyName, setFamilyName] = useState("");
  const [country, setCountry] = useState("");
  const [complianceStatus, setComplianceStatus] = useState("green");
  const [childName, setChildName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [boneAge, setBoneAge] = useState("");

  useEffect(() => {
    if (open) {
      setFamilyName("");
      setCountry("");
      setComplianceStatus("green");
      setChildName("");
      setBirthday("");
      setBoneAge("");
    }
  }, [open]);

  const handleSave = () => {
    if (familyName && country && childName && birthday) {
      onSave?.({
        family: {
          familyName,
          country,
          managerId,
          complianceStatus,
        },
        child: {
          name: childName,
          birthday,
          boneAge: boneAge ? parseFloat(boneAge) : null,
        },
      });
    }
  };

  const isValid = familyName && country && childName && birthday;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-add-family-with-child">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '新增家庭與孩童' : 'Add Family & Child'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '建立新的家庭並同時新增第一位孩童' : 'Create a new family with the first child'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Family Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              {language === 'zh-TW' ? '家庭資料' : 'Family Information'}
            </h3>
            
            <div className="grid gap-2">
              <Label htmlFor="family-name">
                {language === 'zh-TW' ? '家庭名稱' : 'Family Name'} *
              </Label>
              <Input
                id="family-name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder={language === 'zh-TW' ? '例如：李家' : 'e.g., Lee Family'}
                data-testid="input-family-name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">
                {language === 'zh-TW' ? '國家' : 'Country'} *
              </Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={language === 'zh-TW' ? '例如：台灣、新加坡、馬來西亞' : 'e.g., Taiwan, Singapore, Malaysia'}
                data-testid="input-country"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="compliance-status">
                {language === 'zh-TW' ? '合規狀態' : 'Compliance Status'}
              </Label>
              <Select value={complianceStatus} onValueChange={setComplianceStatus}>
                <SelectTrigger id="compliance-status" data-testid="select-compliance-status">
                  <SelectValue />
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
          </div>

          <Separator />

          {/* Child Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              {language === 'zh-TW' ? '孩童資料' : 'Child Information'}
            </h3>
            
            <div className="grid gap-2">
              <Label htmlFor="child-name">
                {language === 'zh-TW' ? '孩童姓名' : 'Child Name'} *
              </Label>
              <Input
                id="child-name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={language === 'zh-TW' ? '例如：小明' : 'e.g., Ming'}
                data-testid="input-child-name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthday">
                {language === 'zh-TW' ? '出生日期' : 'Birthday'} *
              </Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                data-testid="input-birthday"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bone-age">
                {language === 'zh-TW' ? '骨齡（歲）' : 'Bone Age (years)'}
              </Label>
              <Input
                id="bone-age"
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={boneAge}
                onChange={(e) => setBoneAge(e.target.value)}
                placeholder={language === 'zh-TW' ? '例如：8.5（選填）' : 'e.g., 8.5 (optional)'}
                data-testid="input-bone-age"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isPending}
            data-testid="button-cancel"
          >
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isValid || isPending}
            data-testid="button-save"
          >
            {isPending ? (language === 'zh-TW' ? '儲存中...' : 'Saving...') : t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
