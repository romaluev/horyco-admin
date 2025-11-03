'use strict';

import React from 'react';

import PageContainer from '@/shared/ui/layout/page-container';

interface OverViewLayoutProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  area_stats: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  bar_stats: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  pie_stats: React.ReactNode;
  sales: React.ReactNode;
}

export default function OverViewLayout({
  children,
  area_stats,
  bar_stats,
  pie_stats,
  sales
}: OverViewLayoutProps) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        {children}
        {area_stats}
        {bar_stats}
        {pie_stats}
        {sales}
      </div>
    </PageContainer>
  );
}
