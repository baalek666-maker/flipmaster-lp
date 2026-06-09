import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnemyRow {
  enemy: string;
  damage: string;
  symptom: string;
  appearance: string;
  icon: string;
  level: 'critical' | 'high' | 'medium';
}

interface BlogEnemyTableProps {
  rows: EnemyRow[];
}

const levelStyles = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
};

const levelLabels = {
  critical: 'Critique',
  high: 'Élevé',
  medium: 'Modéré',
};

export default function BlogEnemyTable({ rows }: BlogEnemyTableProps) {
  return (
    <div className="space-y-3 not-prose">
      {rows.map((row, i) => (
        <Card
          key={i}
          className="border-white/[0.06] bg-white/[0.02] hover:border-red-500/15 hover:bg-white/[0.04] transition-all duration-200"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-lg">{row.icon}</span>
                {row.enemy}
              </span>
              <Badge variant="outline" className={`text-[0.65rem] px-2 py-0 ${levelStyles[row.level]}`}>
                {levelLabels[row.level]}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2">
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Dégât</span>
                <p className="text-sm text-gray-300 mt-0.5">{row.damage}</p>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Symptôme</span>
                <p className="text-sm text-gray-300 mt-0.5">{row.symptom}</p>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">À quoi ça ressemble</span>
                <p className="text-sm text-gray-300 mt-0.5">{row.appearance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}