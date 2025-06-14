import { delay } from '@/shared/config/mock-api';
import { PieGraph } from '@/entities/overview/components/pie-graph';

export default async function Stats() {
  await delay(1000);
  return <PieGraph />;
}
