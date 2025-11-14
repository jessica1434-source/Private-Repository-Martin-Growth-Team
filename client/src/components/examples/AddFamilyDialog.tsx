import { useState } from 'react';
import AddFamilyDialog from '../AddFamilyDialog';
import { Button } from '@/components/ui/button';

export default function AddFamilyDialogExample() {
  const [open, setOpen] = useState(false);

  const mockManagers = [
    { id: '1', name: '陳美玲' },
    { id: '2', name: '林志明' },
    { id: '3', name: '王小華' },
  ];

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>打開建立家庭對話框</Button>
      <AddFamilyDialog
        open={open}
        onOpenChange={setOpen}
        language="zh-TW"
        managers={mockManagers}
        onSave={(data) => console.log('Family saved:', data)}
      />
    </div>
  );
}
