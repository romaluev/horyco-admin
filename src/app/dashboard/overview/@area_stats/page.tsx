import { delay } from '@/shared/config/mock-api';
import { AreaGraph } from '@/entities/overview/components/area-graph';

export default async function AreaStats() {
  await await delay(2000);
  return <AreaGraph />;
}
