import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  items: FAQItem[];
}

export default function BlogFAQ({ items }: BlogFAQProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-purple-500/10">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="text-2xl">❓</span>
        Questions fréquentes
      </h2>
      <Accordion type="single" collapsible className="space-y-3">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-colors px-5 data-[state=open]:border-purple-500/25 data-[state=open]:bg-purple-500/[0.03]"
          >
            <AccordionTrigger className="text-white font-medium text-left hover:no-underline py-5 text-[0.95rem] leading-relaxed">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-400 leading-relaxed pb-5 text-[0.9rem]">
              <p>{item.answer}</p>
              <a
                href="/quiz/"
                className="mt-4 inline-block rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-bold text-white text-center hover:bg-purple-500 hover:-translate-y-0.5 transition-all hover:shadow-[0_4px_15px_rgba(147,51,234,0.4)] max-w-full"
              >
                Prend le contrôle de tes reventes →
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}