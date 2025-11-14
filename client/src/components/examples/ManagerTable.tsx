import ManagerTable from '../ManagerTable';

export default function ManagerTableExample() {
  const mockManagers = [
    { id: '1', name: '陳美玲', email: 'chen@example.com', familiesCount: 4, childrenCount: 8 },
    { id: '2', name: '林志明', email: 'lin@example.com', familiesCount: 3, childrenCount: 6 },
    { id: '3', name: '王小華', email: 'wang@example.com', familiesCount: 5, childrenCount: 10 },
  ];

  return (
    <div className="p-6">
      <ManagerTable 
        managers={mockManagers}
        language="zh-TW"
        onEdit={(id) => console.log('Edit manager:', id)}
        onDelete={(id) => console.log('Delete manager:', id)}
      />
    </div>
  );
}
