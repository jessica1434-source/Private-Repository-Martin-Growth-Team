import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: string;
}

export default function MetricCard({ title, value, icon: Icon, description, trend }: MetricCardProps) {
  return (
    <Card data-testid={`card-metric-${title}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-mono" data-testid={`text-metric-value-${title}`}>{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
            {trend && <span className="ml-1">{trend}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
