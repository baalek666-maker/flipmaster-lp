import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import type { ReactNode } from 'react';

interface TabEntry {
  value: string;
  label: string;
  content: ReactNode;
}

interface BlogTabsProps {
  defaultValue?: string;
  className?: string;
  tabs: TabEntry[];
}

export default function BlogTabs({ defaultValue, className, tabs }: BlogTabsProps) {
  const defaultVal = defaultValue || tabs[0]?.value || 'tab1';
  return (
    <Tabs defaultValue={defaultVal} className={`not-prose w-full ${className || ''}`}>
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}