import { Card, CardContent } from '@/components/ui/card';

interface PricingRow {
  format: string;
  buyPrice: string;
  resaleValue: string;
  loss: string;
}

interface BlogPricingTableProps {
  rows: PricingRow[];
  title?: string;
}

const labelClass = 'text-[0.65rem] uppercase tracking-wider text-gray-500';

export default function BlogPricingTable({ rows, title }: BlogPricingTableProps) {
  return (
    <div className="not-prose">
      {title && (
        <p className="text-sm font-medium text-[#e0d7ff] mb-3">{title}</p>
      )}
      <Card className="border-white/5 bg-gradient-to-br from-[rgba(15,15,20,0.8)] to-[rgba(10,10,15,0.5)] backdrop-blur-xl overflow-hidden">
        {/* Header — desktop */}
        <div className="hidden sm:grid grid-cols-4 gap-2 px-4 py-2.5 bg-[rgba(139,92,246,0.06)] border-b border-white/5 text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">
          <span>Format</span>
          <span>Prix d'achat</span>
          <span>Valeur revente</span>
          <span>Perte</span>
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
              <div className="hidden sm:grid grid-cols-4 gap-2 text-sm">
                <span className="text-gray-200 font-medium">{row.format}</span>
                <span className="text-gray-300">{row.buyPrice}</span>
                <span className="text-gray-300">{row.resaleValue}</span>
                <span className="text-red-400 font-semibold">{row.loss}</span>
              </div>
              {/* Mobile card */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-200 font-medium text-sm">{row.format}</span>
                  <span className="text-red-400 font-semibold text-sm shrink-0">{row.loss}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <span className={`${labelClass} block`}>Prix d'achat</span>
                    <span className="text-sm text-gray-300">{row.buyPrice}</span>
                  </div>
                  <div>
                    <span className={`${labelClass} block`}>Valeur revente</span>
                    <span className="text-sm text-gray-300">{row.resaleValue}</span>
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