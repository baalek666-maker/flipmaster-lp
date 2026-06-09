import BlogStatCard from '@/components/BlogStatCard';

interface StatItem {
  emoji: string;
  value: string;
  label: string;
  accent?: 'purple' | 'red' | 'green' | 'amber';
}

interface StatCardsProps {
  stats: StatItem[];
}

export default function BlogStatCards({ stats }: StatCardsProps) {
  return (
    <div className="not-prose grid grid-cols-1 gap-3 my-8 sm:grid-cols-3 sm:gap-4">
      {stats.map((stat, i) => (
        <BlogStatCard
          key={i}
          emoji={stat.emoji}
          value={stat.value}
          label={stat.label}
          accent={stat.accent}
        />
      ))}
    </div>
  );
}