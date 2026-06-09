import { Card, CardContent } from '@/components/ui/card';

interface BlogProsConsProps {
  pros: string[];
  cons: string[];
}

export default function BlogProsCons({ pros, cons }: BlogProsConsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
      <Card className="border-emerald-500/15 bg-gradient-to-br from-[rgba(34,197,94,0.04)] to-[rgba(10,10,15,0.4)] backdrop-blur-xl hover:border-emerald-500/25 transition-all duration-200">
        <CardContent className="p-5">
          <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span aria-hidden="true">✅</span> Avantages
          </h4>
          <ul className="space-y-2 m-0 p-0 list-none">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="text-emerald-400 mt-0.5 shrink-0 text-xs">▸</span>
                {pro}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-red-500/15 bg-gradient-to-br from-[rgba(239,68,68,0.04)] to-[rgba(10,10,15,0.4)] backdrop-blur-xl hover:border-red-500/25 transition-all duration-200">
        <CardContent className="p-5">
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span aria-hidden="true">❌</span> Inconvénients
          </h4>
          <ul className="space-y-2 m-0 p-0 list-none">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                <span className="text-red-400 mt-0.5 shrink-0 text-xs">▸</span>
                {con}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}