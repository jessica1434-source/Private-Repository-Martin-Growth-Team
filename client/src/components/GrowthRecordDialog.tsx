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
import { Textarea } from "@/components/ui/textarea";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface GrowthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
  language: Language;
  onSave?: (data: { date: string; height: number; weight: number; notes: string }) => void;
}

export default function GrowthRecordDialog({
  open,
  onOpenChange,
  childName,
  language,
  onSave,
}: GrowthRecordDialogProps) {
  const t = useTranslation(language);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (height && weight) {
      onSave?.({
        date,
        height: parseFloat(height),
        weight: parseFloat(weight),
        notes,
      });
      onOpenChange(false);
      setHeight('');
      setWeight('');
      setNotes('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-growth-record">
        <DialogHeader>
          <DialogTitle>{t.addGrowthRecord}</DialogTitle>
          <DialogDescription>
            {childName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">{t.date}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="height">{t.height} ({t.cm})</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="125.5"
                data-testid="input-height"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">{t.weight} ({t.kg})</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="24.5"
                data-testid="input-weight"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{t.notes}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'zh-TW' ? '輸入備註...' : 'Enter notes...'}
              className="min-h-32"
              data-testid="input-notes"
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
