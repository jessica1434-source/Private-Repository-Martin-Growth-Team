import { useState } from "react";
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
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface AddManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  onSave?: (data: { name: string; email: string }) => void;
}

export default function AddManagerDialog({
  open,
  onOpenChange,
  language,
  onSave,
}: AddManagerDialogProps) {
  const t = useTranslation(language);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    if (name && email) {
      onSave?.({ name, email });
      onOpenChange(false);
      setName('');
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-manager">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '新增管理師' : 'Add Manager'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '輸入新管理師的基本資料' : 'Enter new manager information'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="manager-name">
              {language === 'zh-TW' ? '姓名' : 'Name'}
            </Label>
            <Input
              id="manager-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'zh-TW' ? '輸入管理師姓名' : 'Enter manager name'}
              data-testid="input-manager-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manager-email">
              {language === 'zh-TW' ? '電子郵件' : 'Email'}
            </Label>
            <Input
              id="manager-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'zh-TW' ? '輸入電子郵件地址' : 'Enter email address'}
              data-testid="input-manager-email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!name || !email} data-testid="button-save">
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
