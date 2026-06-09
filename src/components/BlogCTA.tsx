import { Card, CardContent } from '@/components/ui/card';

interface BlogCTAProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export default function BlogCTA({ title, description, ctaText, ctaUrl }: BlogCTAProps) {
  return (
    <Card className="not-prose border-purple-500/25 overflow-hidden">
      {/* Accent bar */}
      <div className="h-0.5 bg-purple-500" />
      <CardContent className="p-6 sm:p-8 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg mx-auto">
          {description}
        </p>
        <a
          href={ctaUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-purple-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25 active:translate-y-0"
        >
          {ctaText}
        </a>
      </CardContent>
    </Card>
  );
}