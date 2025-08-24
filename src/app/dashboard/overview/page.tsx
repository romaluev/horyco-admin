import { Metadata } from 'next';
import { AnalyticsOverview } from '@/widgets/overview';

export const metadata: Metadata = {
  title: 'Панель управления',
  description: 'Обзор ключевых показателей ресторана'
};

export default function OverviewPage() {
  return <AnalyticsOverview />;
}
