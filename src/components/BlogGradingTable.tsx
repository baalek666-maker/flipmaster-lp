import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GradingRow {
  service: string;
  values: string[];
  highlight?: boolean;
}

interface BlogGradingTableProps {
  headers: string[];
  rows: GradingRow[];
  title?: string;
  accent?: 'purple' | 'green' | 'amber' | 'red';
}

const accentConfig = {
  purple: {
    headerBg: 'bg-purple-500/5',
    badgeBg: 'bg-purple-500/15 text-purple-400',
    highlightBg: 'bg-purple-500/5',
    borderColor: 'border-purple-500/20',
  },
  green: {
    headerBg: 'bg-emerald-500/5',
    badgeBg: 'bg-emerald-500/15 text-emerald-400',
    highlightBg: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/20',
  },
  amber: {
    headerBg: 'bg-amber-500/5',
    badgeBg: 'bg-amber-500/15 text-amber-400',
    highlightBg: 'bg-amber-500/5',
    borderColor: 'border-amber-500/20',
  },
  red: {
    headerBg: 'bg-red-500/5',
    badgeBg: 'bg-red-500/15 text-red-400',
    highlightBg: 'bg-red-500/5',
    borderColor: 'border-red-500/20',
  },
};

const colCount = (len: number) => {
  if (len <= 3) return 'grid-cols-3';
  if (len === 4) return 'grid-cols-4';
  if (len === 5) return 'grid-cols-5';
  return 'grid-cols-5';
};

export default function BlogGradingTable({ headers, rows, title, accent = 'purple' }: BlogGradingTableProps) {
  const colors = accentConfig[accent];

  return (
    <div className="not-prose">
      {title && (
        <p className="text-sm font-medium text-muted-foreground mb-3">{title}</p>
      )}
      <Card className="overflow-hidden">
        {/* Header */}
        <div className={`hidden sm:${colCount(headers.length)} grid gap-2 px-4 py-2.5 ${colors.headerBg} border-b border-border text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold`}>
          {headers.map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>
        <CardContent className="p-0">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`px-4 py-3 ${i < rows.length - 1 ? 'border-b border-border' : ''} ${row.highlight ? colors.highlightBg : ''}`}
            >
              {/* Desktop row */}
              <div className={`hidden sm:grid ${colCount(headers.length)} gap-2 text-sm`}>
                <span className="text-card-foreground font-medium">{row.service}</span>
                {row.values.map((v, j) => (
                  <span key={j} className={row.highlight && j === 0 ? 'text-card-foreground font-semibold' : 'text-muted-foreground'}>
                    {v}
                  </span>
                ))}
              </div>
              {/* Mobile stack */}
              <div className="sm:hidden space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${colors.badgeBg} border-0 text-xs font-semibold`}>
                    {row.service}
                  </Badge>
                </div>
                {headers.slice(1).map((h, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-xs">{h}</span>
                    <span className="text-card-foreground">{row.values[j]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}