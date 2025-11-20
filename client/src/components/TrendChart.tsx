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
  data: Record<string, TrendData[]>;
  language: Language;
}

export default function TrendChart({ title, data, language }: TrendChartProps) {
  const t = useTranslation(language);
  const countries = Object.keys(data);
  const defaultCountry = countries[0] || '';

  // Helper function to format month from YYYY-MM to readable format
  const formatMonth = (monthStr: string, lang: Language) => {
    const [year, month] = monthStr.split('-');
    const monthNum = parseInt(month, 10);
    if (lang === 'zh-TW') {
      return `${monthNum}月`;
    }
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthNum - 1];
  };

  if (countries.length === 0) {
    return (
      <Card data-testid="card-trend-chart">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {language === 'zh-TW' ? '暫無數據' : 'No data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-trend-chart">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultCountry} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(countries.length, 6)}, minmax(0, 1fr))` }}>
            {countries.map((country) => (
              <TabsTrigger key={country} value={country} data-testid={`tab-${country}`}>
                {country}
              </TabsTrigger>
            ))}
          </TabsList>
          {countries.map((country) => {
            // Format month data for display
            const formattedData = data[country].map(item => ({
              ...item,
              month: formatMonth(item.month, language)
            }));
            
            return (
              <TabsContent key={country} value={country}>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
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
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
