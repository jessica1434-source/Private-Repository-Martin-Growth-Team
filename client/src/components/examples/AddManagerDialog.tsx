import { useState } from 'react';
import AddManagerDialog from '../AddManagerDialog';
import { Button } from '@/components/ui/button';

export default function AddManagerDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>打開新增管理師對話框</Button>
      <AddManagerDialog
        open={open}
        onOpenChange={setOpen}
        language="zh-TW"
        onSave={(data) => console.log('Manager saved:', data)}
      />
    </div>
  );
}
