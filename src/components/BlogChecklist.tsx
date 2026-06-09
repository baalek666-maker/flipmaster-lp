import { Card, CardContent } from '@/components/ui/card';

interface BlogChecklistProps {
  title?: string;
  items: string[];
}

export default function BlogChecklist({ title = 'L\'essentiel à retenir', items }: BlogChecklistProps) {
  return (
    <Card className="border-purple-500/15 not-prose overflow-hidden">
      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-purple-500 rounded-l-xl" />
      <CardContent className="p-4 sm:p-5 sm:pl-6 pl-5">
        <h3 className="text-base font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <span aria-hidden="true">📋</span> {title}
        </h3>
        <ul className="space-y-3 m-0 p-0 list-none">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/15 text-purple-400 text-[0.65rem]">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}