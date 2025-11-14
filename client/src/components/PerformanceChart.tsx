import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Language } from "@/lib/i18n";

interface PerformanceChartProps {
  title: string;
  data: Array<{ name: string; height: number; weight: number }>;
  language: Language;
}

export default function PerformanceChart({ title, data, language }: PerformanceChartProps) {
  return (
    <Card data-testid="card-performance-chart">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
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
              <Bar 
                dataKey="height" 
                fill="hsl(var(--chart-1))" 
                name={language === 'zh-TW' ? '平均身高增長 (cm)' : 'Avg Height Growth (cm)'}
              />
              <Bar 
                dataKey="weight" 
                fill="hsl(var(--chart-2))" 
                name={language === 'zh-TW' ? '平均體重增長 (kg)' : 'Avg Weight Growth (kg)'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
