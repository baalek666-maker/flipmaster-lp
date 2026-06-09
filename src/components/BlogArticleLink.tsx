import { Card, CardContent } from '@/components/ui/card';

interface BlogArticleLinkProps {
  question: string;
  linkText: string;
  href: string;
}

export default function BlogArticleLink({ question, linkText, href }: BlogArticleLinkProps) {
  return (
    <Card className="not-prose border-blue-500/15 overflow-hidden">
      <CardContent className="p-4 flex items-center gap-3">
        <span className="text-blue-400 text-lg">📄</span>
        <p className="text-sm leading-relaxed">
          <strong className="text-card-foreground">{question}</strong>{' '}
          <a
            href={href}
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors underline underline-offset-2 decoration-blue-400/30 hover:decoration-blue-300/50"
          >
            {linkText}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}