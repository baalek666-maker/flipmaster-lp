import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationRow {
  location: string;
  advantage: string;
  risk: string;
  verdict: 'best' | 'ok' | 'caution' | 'never';
  icon: string;
}

interface BlogLocationComparisonProps {
  rows: LocationRow[];
}

const verdictStyles = {
  best: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  ok: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  caution: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  never: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const verdictLabels = {
  best: '✅ Meilleur choix',
  ok: '✅ Correct',
  caution: '⚠️ Avec précaution',
  never: '❌ Jamais',
};

export default function BlogLocationComparison({ rows }: BlogLocationComparisonProps) {
  return (
    <div className="space-y-3 not-prose">
      {rows.map((row, i) => (
        <Card
          key={i}
          className={`border-white/[0.06] bg-white/[0.02] hover:border-purple-500/15 hover:bg-white/[0.04] transition-all duration-200`}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="text-lg">{row.icon}</span>
                {row.location}
              </span>
              <Badge variant="outline" className={`text-[0.65rem] px-2 py-0 whitespace-normal break-words ${verdictStyles[row.verdict]}`}>
                {verdictLabels[row.verdict]}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2">
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Avantage</span>
                <p className="text-sm text-emerald-300/80 mt-0.5">{row.advantage}</p>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-500">Risque</span>
                <p className="text-sm text-red-300/80 mt-0.5">{row.risk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}