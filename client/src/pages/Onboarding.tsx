import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserCircle } from "lucide-react";

const onboardingSchema = z.object({
  name: z.string().min(2, "姓名至少需要2個字").max(50, "姓名不能超過50個字"),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

interface OnboardingProps {
  userEmail: string;
  onComplete: () => void;
}

export default function Onboarding({ userEmail, onComplete }: OnboardingProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create profile");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "註冊成功！",
        description: "歡迎加入兒童成長管理系統",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "註冊失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: OnboardingForm) => {
    setIsSubmitting(true);
    createProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">歡迎使用兒童成長管理系統</CardTitle>
          <CardDescription>
            您正在使用 {userEmail} 登入<br />
            請填寫基本資料完成註冊
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>您的姓名 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="請輸入您的姓名"
                        {...field}
                        data-testid="input-name"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">📋 您將成為「管理師」</p>
                <p className="text-muted-foreground">
                  註冊後您可以：
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>管理您的家庭資料</li>
                  <li>記錄兒童成長數據</li>
                  <li>追蹤服務執行狀況</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-complete-onboarding"
              >
                {isSubmitting ? "註冊中..." : "完成註冊"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
