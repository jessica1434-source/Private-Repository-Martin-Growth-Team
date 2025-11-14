import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex gap-2">
        <StatusBadge status="green" language="zh-TW" />
        <StatusBadge status="yellow" language="zh-TW" />
        <StatusBadge status="red" language="zh-TW" />
      </div>
      <div className="flex gap-2">
        <StatusBadge status="green" language="en" />
        <StatusBadge status="yellow" language="en" />
        <StatusBadge status="red" language="en" />
      </div>
      <div className="flex gap-2">
        <StatusBadge status="green" language="zh-TW" showLabel={false} />
        <StatusBadge status="yellow" language="zh-TW" showLabel={false} />
        <StatusBadge status="red" language="zh-TW" showLabel={false} />
      </div>
    </div>
  );
}
