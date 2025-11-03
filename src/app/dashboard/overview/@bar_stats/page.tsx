import { delay } from '@/shared/config/mock-api'

import { BarGraph } from '@/widgets/overview'

export default async function BarStats() {
  await await delay(1000)

  return <BarGraph />
}
