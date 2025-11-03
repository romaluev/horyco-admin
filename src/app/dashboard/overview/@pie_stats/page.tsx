import { delay } from '@/shared/config/mock-api'

import { PieGraph } from '@/widgets/overview'

export default async function Stats() {
  await delay(1000)
  return <PieGraph />
}
