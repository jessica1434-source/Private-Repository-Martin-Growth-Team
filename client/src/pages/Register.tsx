import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, LogIn } from "lucide-react";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "註冊失敗");
      }

      toast({
        title: "註冊成功！",
        description: `歡迎加入，${result.manager.name}`,
      });

      // Auto-login after registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (loginResponse.ok) {
        onRegisterSuccess();
      } else {
        toast({
          title: "註冊成功",
          description: "請返回登入頁面進行登入",
        });
        onSwitchToLogin();
      }
    } catch (error: any) {
      toast({
        title: "註冊失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">註冊新帳號</CardTitle>
          <CardDescription>
            填寫以下資料創建您的帳號
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用戶名 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="3-20個字符"
                        {...field}
                        data-testid="input-register-username"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密碼 *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="至少6個字符"
                        {...field}
                        data-testid="input-register-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="請輸入您的姓名"
                        {...field}
                        data-testid="input-register-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">📋 註冊後您將成為「管理師」</p>
                <p className="text-muted-foreground">
                  您可以管理家庭資料、記錄兒童成長數據、追蹤服務執行狀況
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-register"
              >
                {isSubmitting ? "註冊中..." : "註冊"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            已經有帳號了？
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onSwitchToLogin}
            data-testid="button-switch-to-login"
          >
            <LogIn className="w-4 h-4 mr-2" />
            返回登入
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
