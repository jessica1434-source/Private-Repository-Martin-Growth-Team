import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cake } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface BirthdayCardProps {
  childName: string;
  birthday: string;
  language: Language;
}

export default function BirthdayCard({ childName, birthday, language }: BirthdayCardProps) {
  const t = useTranslation(language);
  const birthdayDate = new Date(birthday);
  const today = new Date();
  
  const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntil = differenceInDays(nextBirthday, today);
  const age = today.getFullYear() - birthdayDate.getFullYear();
  const turningAge = daysUntil === 0 ? age : age + 1;
  
  const isToday = daysUntil === 0;

  return (
    <Card className={isToday ? 'border-primary' : ''} data-testid={`card-birthday-${childName}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <Cake className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium" data-testid={`text-child-name-${childName}`}>{childName}</p>
          <p className="text-xs text-muted-foreground">
            {format(birthdayDate, 'yyyy/MM/dd')} · {turningAge} {t.years}
          </p>
        </div>
        <Badge variant={isToday ? 'default' : 'secondary'} data-testid={`badge-days-until-${childName}`}>
          {isToday ? t.today : `${daysUntil} ${t.daysUntil}`}
        </Badge>
      </CardContent>
    </Card>
  );
}
