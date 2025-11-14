import TrendChart from '../TrendChart';

export default function TrendChartExample() {
  const mockData = {
    taiwan: [
      { month: '7月', height: 118.5, weight: 22.3 },
      { month: '8月', height: 119.2, weight: 22.8 },
      { month: '9月', height: 120.1, weight: 23.2 },
      { month: '10月', height: 120.8, weight: 23.7 },
      { month: '11月', height: 121.5, weight: 24.1 },
    ],
    singapore: [
      { month: '7月', height: 117.2, weight: 21.8 },
      { month: '8月', height: 118.1, weight: 22.3 },
      { month: '9月', height: 118.9, weight: 22.7 },
      { month: '10月', height: 119.6, weight: 23.1 },
      { month: '11月', height: 120.3, weight: 23.5 },
    ],
    malaysia: [
      { month: 'Jul', height: 116.8, weight: 21.5 },
      { month: 'Aug', height: 117.6, weight: 22.0 },
      { month: 'Sep', height: 118.4, weight: 22.4 },
      { month: 'Oct', height: 119.1, weight: 22.9 },
      { month: 'Nov', height: 119.8, weight: 23.3 },
    ],
    brunei: [
      { month: 'Jul', height: 118.0, weight: 22.1 },
      { month: 'Aug', height: 118.7, weight: 22.6 },
      { month: 'Sep', height: 119.5, weight: 23.0 },
      { month: 'Oct', height: 120.2, weight: 23.5 },
      { month: 'Nov', height: 121.0, weight: 23.9 },
    ],
  };

  return (
    <div className="p-6">
      <TrendChart 
        title="跨國群體平均月成長趨勢"
        data={mockData}
        language="zh-TW"
      />
    </div>
  );
}
