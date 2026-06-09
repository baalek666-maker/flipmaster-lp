import { Card, CardContent } from '@/components/ui/card';

interface Step {
  title: string;
  text?: string;
  description?: string;
}

interface BlogStepCardsProps {
  steps: Step[];
}

export default function BlogStepCards({ steps }: BlogStepCardsProps) {
  return (
    <div className="space-y-3 not-prose">
      {steps.map((step, i) => (
        <Card
          key={i}
          className="border-purple-500/15 bg-gradient-to-br from-[rgba(17,17,24,0.6)] to-[rgba(10,10,15,0.4)] backdrop-blur-xl hover:border-purple-500/25 hover:shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:-translate-y-px transition-all duration-200"
        >
          <CardContent className="p-5 pl-14 relative">
            <span
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white font-bold text-sm flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="text-[1.05rem] font-semibold text-[#e0d7ff] mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-[#a0a0b8] leading-relaxed m-0">
              {step.description || step.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}