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
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";
import type { Child } from "@shared/schema";

interface EditChildDialogProps {
  child: Child | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (childId: string, boneAge: number | null) => void;
  language: Language;
}

export default function EditChildDialog({ 
  child, 
  open, 
  onOpenChange, 
  onSave,
  language 
}: EditChildDialogProps) {
  const t = useTranslation(language);
  const [boneAge, setBoneAge] = useState<string>('');

  useEffect(() => {
    if (child) {
      setBoneAge(child.boneAge?.toString() || '');
    }
  }, [child]);

  const handleSave = () => {
    if (!child) return;
    
    const boneAgeValue = boneAge.trim() === '' ? null : parseFloat(boneAge);
    onSave(child.id, boneAgeValue);
  };

  if (!child) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-edit-child">
        <DialogHeader>
          <DialogTitle>{t.editChild}</DialogTitle>
          <DialogDescription>
            {t.childInfo}: {child.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="boneAge">{t.boneAge} ({t.years})</Label>
            <Input
              id="boneAge"
              type="number"
              step="0.1"
              value={boneAge}
              onChange={(e) => setBoneAge(e.target.value)}
              placeholder="0.0"
              data-testid="input-bone-age"
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
