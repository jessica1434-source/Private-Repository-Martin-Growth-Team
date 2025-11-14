import MetricCard from '../MetricCard';
import { Users, Baby, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <MetricCard 
        title="總孩子數" 
        value={32} 
        icon={Baby}
        description="跨 4 個國家"
      />
      <MetricCard 
        title="總管理師人數" 
        value={8} 
        icon={Users}
        description="平均負責 4 個家庭"
      />
      <MetricCard 
        title="高風險家庭" 
        value={3} 
        icon={AlertTriangle}
        trend="↓ 1 from last month"
      />
      <MetricCard 
        title="穩定達標家庭" 
        value={12} 
        icon={CheckCircle}
        trend="↑ 2 from last month"
      />
    </div>
  );
}
