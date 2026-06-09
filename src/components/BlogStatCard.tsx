import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  emoji: string;
  value: string;
  label: string;
  accent?: 'purple' | 'red' | 'green' | 'amber';
}

const accentConfig = {
  purple: {
    card: 'border-purple-500/20',
    value: 'text-purple-400',
    bar: 'bg-purple-500/60',
  },
  red: {
    card: 'border-red-500/20',
    value: 'text-red-400',
    bar: 'bg-red-500/60',
  },
  green: {
    card: 'border-emerald-500/20',
    value: 'text-emerald-400',
    bar: 'bg-emerald-500/60',
  },
  amber: {
    card: 'border-amber-500/20',
    value: 'text-amber-400',
    bar: 'bg-amber-500/60',
  },
} as const;

export default function BlogStatCard({ emoji, value, label, accent = 'purple' }: StatCardProps) {
  const c = accentConfig[accent];

  return (
    <Card className={`group relative overflow-hidden text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${c.card}`}>
      {/* Accent top bar */}
      <div className={`h-0.5 w-full ${c.bar}`} />

      <CardContent className="p-5">
        <div className="text-2xl mb-2">{emoji}</div>
        <div className={`text-2xl font-extrabold tracking-tight leading-tight mb-1 sm:text-3xl ${c.value}`}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">{label}</div>
      </CardContent>
    </Card>
  );
}