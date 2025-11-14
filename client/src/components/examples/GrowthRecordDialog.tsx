import { useState } from 'react';
import GrowthRecordDialog from '../GrowthRecordDialog';
import { Button } from '@/components/ui/button';

export default function GrowthRecordDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <GrowthRecordDialog
        open={open}
        onOpenChange={setOpen}
        childName="李小明"
        language="zh-TW"
        onSave={(data) => console.log('Saved:', data)}
      />
    </div>
  );
}
