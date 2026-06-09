import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { ReactNode } from 'react';

interface AccordionEntry {
  value: string;
  trigger: string;
  content: ReactNode;
}

interface BlogAccordionProps {
  type?: 'single' | 'multiple';
  className?: string;
  items: AccordionEntry[];
}

export default function BlogAccordion({ type = 'single', className, items }: BlogAccordionProps) {
  return (
    <Accordion type={type} collapsible className={`not-prose w-full ${className || ''}`}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="text-base font-semibold">{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}