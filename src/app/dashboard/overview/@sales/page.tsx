import { delay } from '@/shared/config/mock-api';
import { RecentSales } from '@/entities/overview/components/recent-sales';

export default async function Sales() {
  await delay(3000);
  return <RecentSales />;
}
