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
    <Card data-testid={`card-metric-${title}`} className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono mb-1" data-testid={`text-metric-value-${title}`}>{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {description}
            {trend && <span className="ml-1 font-medium">{trend}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
