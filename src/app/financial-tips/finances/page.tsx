import { getFinanzPostsByTopic } from '@/lib/finanztipps';
import { CategoryContent } from '../category-content';

export const metadata = {
  title: 'Financial tips – Finances',
  description: 'Posts on finances and wealth building.',
};

export default function FinancesPage() {
  const posts = getFinanzPostsByTopic('finances');
  return <CategoryContent topic="finances" posts={posts} />;
}
