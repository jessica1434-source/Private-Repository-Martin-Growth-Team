import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface TestModeMessageProps {
  userEmail: string;
  roleName: string;
  onBackToRoleSelection: () => void;
  onLogout: () => void;
}

export default function TestModeMessage({
  userEmail,
  roleName,
  onBackToRoleSelection,
  onLogout,
}: TestModeMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">測試模式說明</CardTitle>
              <CardDescription>目前使用：{userEmail}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="mb-4">
              您選擇了<strong>「{roleName}」</strong>角色進行測試，但由於您的帳號沒有關聯的管理師資料，
              無法訪問真實的系統數據。
            </p>
            <p className="text-sm text-muted-foreground">
              如需體驗完整功能和查看真實數據，請使用以下預設測試帳號重新登入。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">📧 可用的測試帳號：</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">👑 老闆/總經理</h4>
                <p className="text-sm text-muted-foreground mb-2">完整系統訪問權限，查看所有數據和跨國趨勢分析</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">boss@example.com</code>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">👥 主任管理師</h4>
                <p className="text-sm text-muted-foreground mb-2">管理旗下管理師團隊，查看所屬管理師的家庭追蹤情況</p>
                <div className="space-y-1">
                  <div><code className="text-sm bg-muted px-2 py-1 rounded">supervisor1@example.com</code> - 黃主任</div>
                  <div><code className="text-sm bg-muted px-2 py-1 rounded">supervisor2@example.com</code> - 周主任</div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">📋 管理師</h4>
                <p className="text-sm text-muted-foreground mb-2">管理指定家庭，記錄兒童成長數據</p>
                <div className="grid grid-cols-2 gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">manager1@example.com</code>
                  <code className="text-sm bg-muted px-2 py-1 rounded">manager2@example.com</code>
                  <code className="text-sm bg-muted px-2 py-1 rounded">manager3@example.com</code>
                  <code className="text-sm bg-muted px-2 py-1 rounded">manager4@example.com</code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onBackToRoleSelection}
              className="flex-1"
              data-testid="button-back-to-role-selection"
            >
              返回角色選擇
            </Button>
            <Button
              onClick={onLogout}
              className="flex-1"
              data-testid="button-logout"
            >
              登出並使用測試帳號登入
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            💡 提示：使用測試帳號登入時，系統會自動發送驗證碼到該 email，請在 Replit Auth 頁面輸入驗證碼即可
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
