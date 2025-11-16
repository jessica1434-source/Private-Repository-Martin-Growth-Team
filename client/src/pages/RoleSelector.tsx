import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Crown } from "lucide-react";

interface RoleSelectorProps {
  userEmail: string;
  onRoleSelected: (role: 'boss' | 'supervisor' | 'manager', managerId: string) => void;
}

export default function RoleSelector({ userEmail, onRoleSelected }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<'boss' | 'supervisor' | 'manager' | null>(null);

  const roles = [
    {
      id: 'boss',
      title: '老闆/總經理',
      description: '完整的系統訪問權限，包括所有管理師和主任的數據、跨國趨勢分析、績效管理',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      id: 'supervisor',
      title: '主任管理師',
      description: '管理旗下的管理師團隊，查看和監督所屬管理師的家庭追蹤情況',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'manager',
      title: '管理師',
      description: '直接管理分配的家庭，記錄兒童成長數據，追蹤服務執行狀況',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
  ];

  const handleRoleSelect = (role: 'boss' | 'supervisor' | 'manager') => {
    // Generate a temporary ID for the test session
    const tempId = `temp-${role}-${Date.now()}`;
    onRoleSelected(role, tempId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">選擇您的測試角色</h1>
          <p className="text-muted-foreground">
            歡迎 {userEmail}！請選擇要測試的角色
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover-elevate ${
                selectedRole === role.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedRole(role.id as any)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-full ${role.bgColor} flex items-center justify-center mb-4 mx-auto`}>
                  <role.icon className={`h-8 w-8 ${role.color}`} />
                </div>
                <CardTitle className="text-center text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  {role.description}
                </CardDescription>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect(role.id as any);
                  }}
                  data-testid={`button-select-${role.id}`}
                >
                  選擇此角色
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            登出
          </Button>
        </div>
      </div>
    </div>
  );
}
