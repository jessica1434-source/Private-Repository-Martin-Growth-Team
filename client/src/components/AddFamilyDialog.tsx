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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface Manager {
  id: string;
  name: string;
}

interface Child {
  name: string;
  birthday: string;
  initialHeight: string;
  initialWeight: string;
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
    children: Child[];
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
  const [familyName, setFamilyName] = useState('');
  const [country, setCountry] = useState('');
  const [managerId, setManagerId] = useState('');
  const [children, setChildren] = useState<Child[]>([{ name: '', birthday: '', initialHeight: '', initialWeight: '' }]);

  const handleAddChild = () => {
    setChildren([...children, { name: '', birthday: '', initialHeight: '', initialWeight: '' }]);
  };

  const handleRemoveChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: 'name' | 'birthday' | 'initialHeight' | 'initialWeight', value: string) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
  };

  const handleSave = () => {
    const validChildren = children.filter(c => c.name && c.birthday && c.initialHeight && c.initialWeight);
    if (familyName && country && managerId && validChildren.length > 0) {
      onSave?.({
        familyName,
        country,
        managerId,
        children: validChildren,
      });
      onOpenChange(false);
      setFamilyName('');
      setCountry('');
      setManagerId('');
      setChildren([{ name: '', birthday: '', initialHeight: '', initialWeight: '' }]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-add-family">
        <DialogHeader>
          <DialogTitle>
            {language === 'zh-TW' ? '建立家庭資料' : 'Create Family Profile'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh-TW' ? '輸入家庭和孩子的基本資料' : 'Enter family and children information'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="family-name">
              {language === 'zh-TW' ? '家庭名稱' : 'Family Name'}
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
              {language === 'zh-TW' ? '國家' : 'Country'}
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" data-testid="select-country">
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
            <Label htmlFor="manager">
              {language === 'zh-TW' ? '指派管理師' : 'Assign Manager'}
            </Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger id="manager" data-testid="select-manager">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{language === 'zh-TW' ? '孩子資料' : 'Children Information'}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChild}
                data-testid="button-add-child"
              >
                <Plus className="h-4 w-4 mr-1" />
                {language === 'zh-TW' ? '新增孩子' : 'Add Child'}
              </Button>
            </div>

            {children.map((child, index) => (
              <div key={index} className="grid gap-3 p-4 border rounded-lg" data-testid={`child-form-${index}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === 'zh-TW' ? `孩子 ${index + 1}` : `Child ${index + 1}`}
                  </span>
                  {children.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveChild(index)}
                      data-testid={`button-remove-child-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`child-name-${index}`}>
                    {language === 'zh-TW' ? '姓名' : 'Name'}
                  </Label>
                  <Input
                    id={`child-name-${index}`}
                    value={child.name}
                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                    placeholder={language === 'zh-TW' ? '輸入孩子姓名' : 'Enter child name'}
                    data-testid={`input-child-name-${index}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`child-birthday-${index}`}>
                    {language === 'zh-TW' ? '生日' : 'Birthday'}
                  </Label>
                  <Input
                    id={`child-birthday-${index}`}
                    type="date"
                    value={child.birthday}
                    onChange={(e) => handleChildChange(index, 'birthday', e.target.value)}
                    data-testid={`input-child-birthday-${index}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor={`child-height-${index}`}>
                      {language === 'zh-TW' ? '初始身高 (cm)' : 'Initial Height (cm)'}
                    </Label>
                    <Input
                      id={`child-height-${index}`}
                      type="number"
                      step="0.1"
                      value={child.initialHeight}
                      onChange={(e) => handleChildChange(index, 'initialHeight', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：120.5' : 'e.g., 120.5'}
                      data-testid={`input-child-height-${index}`}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`child-weight-${index}`}>
                      {language === 'zh-TW' ? '初始體重 (kg)' : 'Initial Weight (kg)'}
                    </Label>
                    <Input
                      id={`child-weight-${index}`}
                      type="number"
                      step="0.1"
                      value={child.initialWeight}
                      onChange={(e) => handleChildChange(index, 'initialWeight', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：25.3' : 'e.g., 25.3'}
                      data-testid={`input-child-weight-${index}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!familyName || !country || !managerId || children.every(c => !c.name || !c.birthday || !c.initialHeight || !c.initialWeight)}
            data-testid="button-save"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
