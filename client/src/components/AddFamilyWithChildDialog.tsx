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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface Child {
  name: string;
  birthday: string;
  boneAge: string;
  height: string;
  weight: string;
}

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
    children: {
      name: string;
      birthday: string;
      boneAge?: number | null;
      height?: number | null;
      weight?: number | null;
    }[];
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
  const [children, setChildren] = useState<Child[]>([
    { name: "", birthday: "", boneAge: "", height: "", weight: "" }
  ]);

  useEffect(() => {
    if (open) {
      setFamilyName("");
      setCountry("");
      setComplianceStatus("green");
      setChildren([{ name: "", birthday: "", boneAge: "", height: "", weight: "" }]);
    }
  }, [open]);

  const addChild = () => {
    setChildren([...children, { name: "", birthday: "", boneAge: "", height: "", weight: "" }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
  };

  const handleSave = () => {
    const allChildrenValid = children.every(child => child.name && child.birthday);
    
    if (familyName && country && allChildrenValid) {
      onSave?.({
        family: {
          familyName,
          country,
          managerId,
          complianceStatus,
        },
        children: children.map(child => ({
          name: child.name,
          birthday: child.birthday,
          boneAge: child.boneAge ? parseFloat(child.boneAge) : null,
          height: child.height ? parseFloat(child.height) : null,
          weight: child.weight ? parseFloat(child.weight) : null,
        })),
      });
    }
  };

  const allChildrenValid = children.every(child => child.name && child.birthday);
  const isValid = familyName && country && allChildrenValid;

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

          {/* Children Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {language === 'zh-TW' ? '孩童資料' : 'Children Information'}
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addChild}
                data-testid="button-add-child"
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === 'zh-TW' ? '新增孩童' : 'Add Child'}
              </Button>
            </div>

            {children.map((child, index) => (
              <Card key={index} data-testid={`card-child-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {language === 'zh-TW' ? `孩童 ${index + 1}` : `Child ${index + 1}`}
                    </CardTitle>
                    {children.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeChild(index)}
                        data-testid={`button-remove-child-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor={`child-name-${index}`}>
                      {language === 'zh-TW' ? '孩童姓名' : 'Child Name'} *
                    </Label>
                    <Input
                      id={`child-name-${index}`}
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：小明' : 'e.g., Ming'}
                      data-testid={`input-child-name-${index}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`birthday-${index}`}>
                      {language === 'zh-TW' ? '出生日期' : 'Birthday'} *
                    </Label>
                    <Input
                      id={`birthday-${index}`}
                      type="date"
                      value={child.birthday}
                      onChange={(e) => updateChild(index, 'birthday', e.target.value)}
                      data-testid={`input-birthday-${index}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`bone-age-${index}`}>
                      {language === 'zh-TW' ? '骨齡（歲）' : 'Bone Age (years)'}
                    </Label>
                    <Input
                      id={`bone-age-${index}`}
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={child.boneAge}
                      onChange={(e) => updateChild(index, 'boneAge', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：8.5（選填）' : 'e.g., 8.5 (optional)'}
                      data-testid={`input-bone-age-${index}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`height-${index}`}>
                      {language === 'zh-TW' ? '身高（公分）' : 'Height (cm)'}
                    </Label>
                    <Input
                      id={`height-${index}`}
                      type="number"
                      step="0.1"
                      min="0"
                      max="300"
                      value={child.height}
                      onChange={(e) => updateChild(index, 'height', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：120.5（選填）' : 'e.g., 120.5 (optional)'}
                      data-testid={`input-height-${index}`}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`weight-${index}`}>
                      {language === 'zh-TW' ? '體重（公斤）' : 'Weight (kg)'}
                    </Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      step="0.1"
                      min="0"
                      max="200"
                      value={child.weight}
                      onChange={(e) => updateChild(index, 'weight', e.target.value)}
                      placeholder={language === 'zh-TW' ? '例如：25.3（選填）' : 'e.g., 25.3 (optional)'}
                      data-testid={`input-weight-${index}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
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
