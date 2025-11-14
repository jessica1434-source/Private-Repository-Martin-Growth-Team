import { useState } from 'react';
import FamilyStatusDialog from '../FamilyStatusDialog';
import { Button } from '@/components/ui/button';

export default function FamilyStatusDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Status Dialog</Button>
      <FamilyStatusDialog
        open={open}
        onOpenChange={setOpen}
        familyName="李家"
        currentStatus="green"
        currentNotes="配合度佳，按時執行"
        language="zh-TW"
        onSave={(data) => console.log('Saved:', data)}
      />
    </div>
  );
}
