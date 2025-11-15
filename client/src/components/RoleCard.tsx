import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function RoleCard({ title, description, icon: Icon, onClick }: RoleCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 hover:shadow-lg group border-2" 
      onClick={onClick}
      data-testid={`card-role-${title}`}
    >
      <CardContent className="flex flex-col items-center justify-center p-12 min-h-72 relative">
        <div className="rounded-full bg-primary/10 p-8 mb-8 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">{description}</p>
        <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-8">
          <span>開始使用</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </CardContent>
    </Card>
  );
}
