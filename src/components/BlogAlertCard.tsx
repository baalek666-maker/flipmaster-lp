import { Card, CardContent } from '@/components/ui/card';

interface BlogAlertCardProps {
  variant: 'error' | 'success' | 'warning' | 'info';
  title: string;
  children: string;
}

const variants = {
  error: {
    border: 'border-red-500/20',
    bar: 'bg-red-500',
    titleColor: 'text-red-400',
    icon: '⚠️',
  },
  success: {
    border: 'border-emerald-500/20',
    bar: 'bg-emerald-500',
    titleColor: 'text-emerald-400',
    icon: '💰',
  },
  warning: {
    border: 'border-amber-500/20',
    bar: 'bg-amber-500',
    titleColor: 'text-amber-400',
    icon: '⚡',
  },
  info: {
    border: 'border-blue-500/20',
    bar: 'bg-blue-500',
    titleColor: 'text-blue-400',
    icon: '💡',
  },
};

export default function BlogAlertCard({ variant, title, children }: BlogAlertCardProps) {
  const v = variants[variant];

  return (
    <Card className={`not-prose overflow-hidden ${v.border}`}>
      <div className={`absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl ${v.bar}`} />
      <CardContent className="p-5 pl-6">
        <h3 className={`text-base font-semibold ${v.titleColor} mb-1.5 flex items-center gap-2`}>
          <span aria-hidden="true">{v.icon}</span> {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed m-0">
          {children}
        </p>
      </CardContent>
    </Card>
  );
}