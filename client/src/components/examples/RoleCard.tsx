import RoleCard from '../RoleCard';
import { Briefcase, Users } from 'lucide-react';

export default function RoleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6">
      <RoleCard 
        title="老闆/主管" 
        description="查看所有數據、管理家庭分配和績效"
        icon={Briefcase}
        onClick={() => console.log('Boss role selected')}
      />
      <RoleCard 
        title="管理師" 
        description="記錄和管理您負責的家庭"
        icon={Users}
        onClick={() => console.log('Manager role selected')}
      />
    </div>
  );
}
