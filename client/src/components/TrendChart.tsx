import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface TrendData {
  month: string;
  height: number;
  weight: number;
}

interface TrendChartProps {
  title: string;
  data: {
    taiwan: TrendData[];
    singapore: TrendData[];
    malaysia: TrendData[];
    brunei: TrendData[];
  };
  language: Language;
}

export default function TrendChart({ title, data, language }: TrendChartProps) {
  const t = useTranslation(language);

  return (
    <Card data-testid="card-trend-chart">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="taiwan" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="taiwan" data-testid="tab-taiwan">{t.taiwan}</TabsTrigger>
            <TabsTrigger value="singapore" data-testid="tab-singapore">{t.singapore}</TabsTrigger>
            <TabsTrigger value="malaysia" data-testid="tab-malaysia">{t.malaysia}</TabsTrigger>
            <TabsTrigger value="brunei" data-testid="tab-brunei">{t.brunei}</TabsTrigger>
          </TabsList>
          {(['taiwan', 'singapore', 'malaysia', 'brunei'] as const).map((country) => (
            <TabsContent key={country} value={country}>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data[country]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.375rem',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="height" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name={language === 'zh-TW' ? '平均身高 (cm)' : 'Avg Height (cm)'}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name={language === 'zh-TW' ? '平均體重 (kg)' : 'Avg Weight (kg)'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
