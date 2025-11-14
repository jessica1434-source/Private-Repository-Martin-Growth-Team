import PerformanceChart from '../PerformanceChart';

export default function PerformanceChartExample() {
  const mockData = [
    { name: '陳美玲', height: 2.3, weight: 0.8 },
    { name: '林志明', height: 1.9, weight: 0.6 },
    { name: '王小華', height: 2.5, weight: 0.9 },
    { name: '張雅婷', height: 2.1, weight: 0.7 },
  ];

  return (
    <div className="p-6">
      <PerformanceChart 
        title="管理師平均月成長績效"
        data={mockData}
        language="zh-TW"
      />
    </div>
  );
}
