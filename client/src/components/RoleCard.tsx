import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function RoleCard({ title, description, icon: Icon, onClick }: RoleCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover-elevate active-elevate-2" 
      onClick={onClick}
      data-testid={`card-role-${title}`}
    >
      <CardContent className="flex flex-col items-center justify-center p-12 min-h-64">
        <Icon className="h-20 w-20 mb-6 text-primary" />
        <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
}
