import FamilyTable from '../FamilyTable';

export default function FamilyTableExample() {
  const mockFamilies = [
    {
      id: 'f1',
      familyName: '李家',
      country: '台灣',
      managerName: '陳美玲',
      childrenCount: 2,
      complianceStatus: 'green' as const,
      notes: '配合度佳',
    },
    {
      id: 'f2',
      familyName: '陳家',
      country: '新加坡',
      managerName: '陳美玲',
      childrenCount: 1,
      complianceStatus: 'yellow' as const,
      notes: '偶爾忘記紀錄',
    },
    {
      id: 'f3',
      familyName: 'Tan Family',
      country: 'Malaysia',
      managerName: '林志明',
      childrenCount: 1,
      complianceStatus: 'green' as const,
      notes: 'Good progress',
    },
  ];

  return (
    <div className="p-6">
      <FamilyTable 
        families={mockFamilies}
        language="zh-TW"
        onView={(id) => console.log('View family:', id)}
        onEdit={(id) => console.log('Edit family:', id)}
      />
    </div>
  );
}
