import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShippingRow {
  value: string;
  protection: string;
  cost: string;
  level: 'basic' | 'standard' | 'premium' | 'insured';
}

interface BlogShippingTableProps {
  rows: ShippingRow[];
}

const levelStyles = {
  basic: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  standard: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  premium: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  insured: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
};

export default function BlogShippingTable({ rows }: BlogShippingTableProps) {
  return (
    <div className="space-y-3 not-prose">
      {rows.map((row, i) => (
        <Card
          key={i}
          className="border-white/[0.06] bg-white/[0.02] hover:border-purple-500/15 hover:bg-white/[0.04] transition-all duration-200"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-white">{row.value}</span>
              <Badge variant="outline" className={`text-[0.65rem] px-2 py-0 ${levelStyles[row.level]}`}>
                {row.cost}
              </Badge>
            </div>
            <p className="text-sm text-gray-300 mt-1">{row.protection}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}