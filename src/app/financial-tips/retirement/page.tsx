import { getFinanzPostsByTopic } from '@/lib/finanztipps';
import { CategoryContent } from '../category-content';

export const metadata = {
  title: 'Financial tips – Retirement',
  description: 'Posts on retirement and insurance.',
};

export default function RetirementPage() {
  const posts = getFinanzPostsByTopic('retirement');
  return <CategoryContent topic="retirement" posts={posts} />;
}
