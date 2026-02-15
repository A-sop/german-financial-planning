import { getAllFinanzPosts } from '@/lib/finanztipps';
import { FinancialTipsHubContent } from './hub-content';

export const metadata = {
  title: 'Financial tips',
  description:
    'Financial tips for you: topics on provision, insurance, and wealth building.',
};

export default function FinancialTipsPage() {
  const posts = getAllFinanzPosts();
  const latest = posts.slice(0, 6);
  return <FinancialTipsHubContent latest={latest} />;
}
