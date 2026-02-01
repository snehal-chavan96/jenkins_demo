import { Badge } from '../ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

// StatusBadge.tsx
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';


interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          bgColor: 'bg-[#FFD166]',
          textColor: 'text-yellow-900',
          borderColor: 'border-[#FFD166]/40',
        };
      case 'APPROVED':
        return {
          icon: CheckCircle,
          bgColor: 'bg-[#3FB984]',
          textColor: 'text-white',
          borderColor: 'border-[#3FB984]/40',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          borderColor: 'border-red-500/40',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      className={`${config.bgColor} ${config.textColor} border-2 ${config.borderColor} rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{status}</span>
    </Badge>
  );
};
