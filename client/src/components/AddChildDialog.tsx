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

interface Family {
  id: string;
  familyName: string;
}

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  families: Family[];
  onSave?: (data: {
    name: string;
    birthday: string;
    familyId: string;
  }) => void;
}

export default function AddChildDialog({
  open,
  onOpenChange,
  language,
  families,
  onSave,
}: AddChildDialogProps) {
  const t = useTranslation(language);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [familyId, setFamilyId] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setBirthday("");
      setFamilyId("");
    }
  }, [open]);

  const handleSave = () => {
    if (name && birthday && familyId) {
      onSave?.({
        name,
        birthday,
        familyId,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-add-child">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '新增孩子' : 'Add Child'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '建立新的孩子資料' : 'Create new child record'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-child-name">
              {language === 'zh-TW' ? '姓名' : 'Name'}
            </Label>
            <Input
              id="add-child-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'zh-TW' ? '例如：李小明' : 'e.g., John Lee'}
              data-testid="input-add-child-name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-child-birthday">
              {language === 'zh-TW' ? '生日' : 'Birthday'}
            </Label>
            <Input
              id="add-child-birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              data-testid="input-add-child-birthday"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-child-family">
              {language === 'zh-TW' ? '家庭' : 'Family'}
            </Label>
            <Select value={familyId} onValueChange={setFamilyId}>
              <SelectTrigger id="add-child-family" data-testid="select-add-child-family">
                <SelectValue placeholder={language === 'zh-TW' ? '選擇家庭' : 'Select family'} />
              </SelectTrigger>
              <SelectContent>
                {families.map(family => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.familyName}
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
            disabled={!name || !birthday || !familyId}
            data-testid="button-save"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
