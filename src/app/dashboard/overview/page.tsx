import { AnalyticsOverview } from '@/widgets/overview';

import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Панель управления',
  description: 'Обзор ключевых показателей ресторана'
};

export default function OverviewPage() {
  return <AnalyticsOverview />;
}
