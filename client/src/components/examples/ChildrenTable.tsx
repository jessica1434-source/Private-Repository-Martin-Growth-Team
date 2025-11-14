import ChildrenTable from '../ChildrenTable';

export default function ChildrenTableExample() {
  const mockChildren = [
    {
      id: 'c1',
      name: '李小明',
      birthday: '2018-03-15',
      familyName: '李家',
      lastHeight: 126.2,
      lastWeight: 24.8,
      lastRecordDate: '2024-11-15',
    },
    {
      id: 'c2',
      name: '李小芳',
      birthday: '2020-07-22',
      familyName: '李家',
      lastHeight: 105.2,
      lastWeight: 17.5,
      lastRecordDate: '2024-10-15',
    },
    {
      id: 'c3',
      name: 'Tan Wei',
      birthday: '2019-05-30',
      familyName: 'Tan Family',
      lastHeight: 118.5,
      lastWeight: 22.1,
      lastRecordDate: '2024-10-20',
    },
  ];

  return (
    <div className="p-6">
      <ChildrenTable 
        children={mockChildren}
        language="zh-TW"
        onAddRecord={(id) => console.log('Add record for:', id)}
        onViewHistory={(id) => console.log('View history for:', id)}
      />
    </div>
  );
}
