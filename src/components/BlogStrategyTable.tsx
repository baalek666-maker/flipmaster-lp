import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StrategyRow {
  level: string;
  budget: string;
  channels: string;
  goal: string;
  accent?: 'purple' | 'green' | 'amber';
}

interface BlogStrategyTableProps {
  rows: StrategyRow[];
}

const accentStyles = {
  purple: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25', dot: 'bg-purple-400' },
  green: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
  amber: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25', dot: 'bg-amber-400' },
};

export default function BlogStrategyTable({ rows }: BlogStrategyTableProps) {
  return (
    <div className="space-y-3 not-prose">
      {rows.map((row, i) => {
        const accent = row.accent ?? (i === 0 ? 'purple' : i === 1 ? 'green' : 'amber');
        const style = accentStyles[accent];
        return (
          <Card key={i} className="border-border hover:border-white/10 transition-all duration-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                <Badge className={`${style.badge} text-xs font-semibold border`}>
                  {row.level}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Budget</span>
                  <p className="text-sm text-card-foreground font-medium mt-0.5">{row.budget}</p>
                </div>
                <div>
                  <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Canaux</span>
                  <p className="text-sm text-card-foreground font-medium mt-0.5">{row.channels}</p>
                </div>
                <div>
                  <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Objectif</span>
                  <p className="text-sm text-card-foreground font-medium mt-0.5">{row.goal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}