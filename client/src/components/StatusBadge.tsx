import { Badge } from "@/components/ui/badge";
import type { Language } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n";

interface StatusBadgeProps {
  status: 'red' | 'yellow' | 'green';
  language: Language;
  showLabel?: boolean;
}

export default function StatusBadge({ status, language, showLabel = true }: StatusBadgeProps) {
  const t = useTranslation(language);
  
  const statusConfig = {
    red: {
      color: 'bg-red-500',
      label: t.red,
      className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    },
    yellow: {
      color: 'bg-yellow-500',
      label: t.yellow,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    green: {
      color: 'bg-green-500',
      label: t.green,
      className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    },
  };

  const config = statusConfig[status];

  if (!showLabel) {
    return <div className={`w-3 h-3 rounded-full ${config.color}`} data-testid={`status-indicator-${status}`} />;
  }

  return (
    <Badge variant="secondary" className={config.className} data-testid={`badge-status-${status}`}>
      <div className={`w-2 h-2 rounded-full ${config.color} mr-1.5`} />
      {config.label}
    </Badge>
  );
}
