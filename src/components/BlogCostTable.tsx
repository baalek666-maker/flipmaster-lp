import { Card, CardContent } from '@/components/ui/card';

interface CostRow {
  card: string;
  nearMint: string;
  lightlyPlayed: string;
  loss: string;
  cause: string;
}

interface BlogCostTableProps {
  rows: CostRow[];
}

const labelClass = 'text-[0.65rem] uppercase tracking-wider text-gray-500';

export default function BlogCostTable({ rows }: BlogCostTableProps) {
  return (
    <div className="not-prose">
      <Card className="border-white/5 bg-gradient-to-br from-[rgba(15,15,20,0.8)] to-[rgba(10,10,15,0.5)] backdrop-blur-xl overflow-hidden">
        {/* Header — desktop */}
        <div className="hidden sm:grid grid-cols-5 gap-3 px-4 py-2.5 bg-[rgba(239,68,68,0.04)] border-b border-white/5 text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">
          <span>Carte</span>
          <span>Prix NM</span>
          <span>Prix LP</span>
          <span>Perte</span>
          <span>Cause</span>
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
              <div className="hidden sm:grid grid-cols-5 gap-3 text-sm">
                <span className="text-gray-200 font-medium">{row.card}</span>
                <span className="text-gray-300">{row.nearMint}</span>
                <span className="text-gray-300">{row.lightlyPlayed}</span>
                <span className="text-red-400 font-semibold">{row.loss}</span>
                <span className="text-gray-400 text-xs">{row.cause}</span>
              </div>
              {/* Mobile card */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-200 font-medium text-sm">{row.card}</span>
                  <span className="text-red-400 font-semibold text-sm shrink-0">{row.loss}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <span className={`${labelClass} block`}>Prix NM</span>
                    <span className="text-sm text-gray-300">{row.nearMint}</span>
                  </div>
                  <div>
                    <span className={`${labelClass} block`}>Prix LP</span>
                    <span className="text-sm text-gray-300">{row.lightlyPlayed}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`${labelClass} block`}>Cause</span>
                    <span className="text-sm text-gray-400">{row.cause}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}