import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Channel {
  name: string;
  buyPercent: string;
  margin: string;
  marginLevel: 'high' | 'medium' | 'low' | 'loss';
  risk: string;
  effort: string;
  icon: string;
}

const channels: Channel[] = [
  {
    name: 'Lots Facebook Groups',
    buyPercent: '20-40%',
    margin: '60-150%',
    marginLevel: 'high',
    risk: 'Moyen',
    effort: 'Moyen',
    icon: '👥',
  },
  {
    name: 'LeBonCoin',
    buyPercent: '25-45%',
    margin: '50-120%',
    marginLevel: 'high',
    risk: 'Faible',
    effort: 'Faible',
    icon: '🔍',
  },
  {
    name: 'Vide-greniers / Brocantes',
    buyPercent: '15-30%',
    margin: '80-200%',
    marginLevel: 'high',
    risk: 'Moyen',
    effort: 'Élevé',
    icon: '🎪',
  },
  {
    name: 'CardMarket (individuel)',
    buyPercent: '70-90%',
    margin: '5-15%',
    marginLevel: 'medium',
    risk: 'Faible',
    effort: 'Faible',
    icon: '💳',
  },
  {
    name: 'Boutiques neuves / Boosters',
    buyPercent: '100%',
    margin: '-40 à -60%',
    marginLevel: 'loss',
    risk: 'Élevé',
    effort: 'Faible',
    icon: '🛒',
  },
  {
    name: 'Liquidations / Clearances',
    buyPercent: '25-35%',
    margin: '70-150%',
    marginLevel: 'high',
    risk: 'Faible',
    effort: 'Moyen',
    icon: '📦',
  },
];

const marginBadgeStyles: Record<Channel['marginLevel'], string> = {
  high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25',
  low: 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25',
  loss: 'bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/25',
};

const marginPrefix: Record<Channel['marginLevel'], string> = {
  high: '🟢',
  medium: '🟡',
  low: '🟡',
  loss: '🔴',
};

const riskBadgeStyles: Record<string, string> = {
  Faible: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Moyen: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Élevé: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const effortBadgeStyles: Record<string, string> = {
  Faible: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Moyen: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Élevé: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const labelClass = 'text-[0.65rem] uppercase tracking-wider text-gray-500';

export default function BlogChannelComparison() {
  return (
    <div className="grid gap-3 not-prose">
      {channels.map((ch) => (
        <Card
          key={ch.name}
          className="border-white/[0.06] bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-200 py-0"
        >
          <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <span className="text-lg">{ch.icon}</span>
                {ch.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-[0.65rem] sm:text-[0.7rem] px-2 sm:px-2.5 py-0.5 whitespace-normal break-words ${marginBadgeStyles[ch.marginLevel]}`}
              >
                {marginPrefix[ch.marginLevel]} Marge {ch.margin}
              </Badge>
            </div>
            <CardDescription className="sr-only">
              {ch.name} : prix d'achat {ch.buyPercent} du prix de revente, marge{' '}
              {ch.margin}, risque {ch.risk}, effort {ch.effort}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 px-4 sm:px-5">
            {/* Desktop: inline chips */}
            <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Achat</span>
                <span className="text-white font-medium">{ch.buyPercent}</span>
                <span className="text-gray-600">du prix revente</span>
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Risque</span>
                <Badge
                  variant="outline"
                  className={`text-[0.65rem] px-1.5 py-0 ${riskBadgeStyles[ch.risk]}`}
                >
                  {ch.risk}
                </Badge>
              </span>
              <span className="text-gray-700">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Effort</span>
                <Badge
                  variant="outline"
                  className={`text-[0.65rem] px-1.5 py-0 ${effortBadgeStyles[ch.effort]}`}
                >
                  {ch.effort}
                </Badge>
              </span>
            </div>
            {/* Mobile: stacked labels */}
            <div className="sm:hidden grid grid-cols-3 gap-2">
              <div>
                <span className={`${labelClass} block`}>Achat</span>
                <span className="text-sm text-white font-medium">{ch.buyPercent}</span>
              </div>
              <div>
                <span className={`${labelClass} block`}>Risque</span>
                <Badge
                  variant="outline"
                  className={`text-[0.65rem] px-1.5 py-0 mt-0.5 ${riskBadgeStyles[ch.risk]}`}
                >
                  {ch.risk}
                </Badge>
              </div>
              <div>
                <span className={`${labelClass} block`}>Effort</span>
                <Badge
                  variant="outline"
                  className={`text-[0.65rem] px-1.5 py-0 mt-0.5 ${effortBadgeStyles[ch.effort]}`}
                >
                  {ch.effort}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}