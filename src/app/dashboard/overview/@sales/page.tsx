import { delay } from '@/shared/config/mock-api';

import { RecentSales } from '@/widgets/overview';

export default async function Sales() {
  await delay(3000);
  return <RecentSales />;
}
