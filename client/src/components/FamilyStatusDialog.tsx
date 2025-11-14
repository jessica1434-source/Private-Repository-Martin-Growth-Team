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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StatusBadge from "./StatusBadge";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface FamilyStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyName: string;
  currentStatus: 'red' | 'yellow' | 'green';
  currentNotes: string;
  language: Language;
  onSave?: (data: { status: 'red' | 'yellow' | 'green'; notes: string }) => void;
}

export default function FamilyStatusDialog({
  open,
  onOpenChange,
  familyName,
  currentStatus,
  currentNotes,
  language,
  onSave,
}: FamilyStatusDialogProps) {
  const t = useTranslation(language);
  const [status, setStatus] = useState<'red' | 'yellow' | 'green'>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);

  const handleSave = () => {
    onSave?.({ status, notes });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-family-status">
        <DialogHeader>
          <DialogTitle>{t.updateStatus}</DialogTitle>
          <DialogDescription>{familyName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label>{t.familyStatus}</Label>
            <RadioGroup value={status} onValueChange={(v) => setStatus(v as any)}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="green" id="green" data-testid="radio-green" />
                <Label htmlFor="green" className="cursor-pointer flex items-center gap-2">
                  <StatusBadge status="green" language={language} />
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yellow" id="yellow" data-testid="radio-yellow" />
                <Label htmlFor="yellow" className="cursor-pointer flex items-center gap-2">
                  <StatusBadge status="yellow" language={language} />
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="red" id="red" data-testid="radio-red" />
                <Label htmlFor="red" className="cursor-pointer flex items-center gap-2">
                  <StatusBadge status="red" language={language} />
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{t.managerNotes}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'zh-TW' ? '輸入管理師意見...' : 'Enter manager notes...'}
              className="min-h-32"
              data-testid="input-manager-notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button onClick={handleSave} data-testid="button-save">
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
