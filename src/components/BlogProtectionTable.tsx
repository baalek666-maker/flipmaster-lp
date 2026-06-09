import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProtectionRow {
  item: string;
  price: string;
  target: string;
  priority: 'required' | 'recommended' | 'optional';
}

interface BlogProtectionTableProps {
  rows: ProtectionRow[];
}

const priorityStyles = {
  required: 'bg-red-500/15 text-red-400 border-red-500/25',
  recommended: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  optional: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
};

const priorityLabels = {
  required: '🔴 Indispensable',
  recommended: '🟡 Recommandé',
  optional: '🟢 Rentable',
};

const labelClass = 'text-[0.65rem] uppercase tracking-wider text-gray-500 sm:hidden';
const valueClass = 'text-sm text-gray-300';

export default function BlogProtectionTable({ rows }: BlogProtectionTableProps) {
  return (
    <div className="not-prose">
      <Card className="border-white/5 bg-gradient-to-br from-[rgba(15,15,20,0.8)] to-[rgba(10,10,15,0.5)] backdrop-blur-xl overflow-hidden">
        {/* Header — desktop */}
        <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2.5 bg-[rgba(139,92,246,0.06)] border-b border-white/5 text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">
          <span>Protection</span>
          <span>Prix</span>
          <span>Pour quoi</span>
          <span>Priorité</span>
        </div>
        <CardContent className="p-0">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`px-4 py-3 ${
                i < rows.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-4 gap-4 text-sm">
                <span className="text-gray-200 font-medium">{row.item}</span>
                <span className={valueClass}>{row.price}</span>
                <span className={valueClass}>{row.target}</span>
                <Badge variant="outline" className={`text-[0.65rem] px-2 py-0 whitespace-normal break-words ${priorityStyles[row.priority]}`}>
                  {priorityLabels[row.priority]}
                </Badge>
              </div>
              {/* Mobile card */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-200 font-medium text-sm">{row.item}</span>
                  <Badge variant="outline" className={`text-[0.65rem] px-2 py-0 whitespace-normal break-words shrink-0 ${priorityStyles[row.priority]}`}>
                    {priorityLabels[row.priority]}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className={labelClass}>Prix</span>
                  <span className={labelClass}>Pour quoi</span>
                  <span className={valueClass}>{row.price}</span>
                  <span className={valueClass}>{row.target}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}