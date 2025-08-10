'use strict';

import React from 'react';
import PageContainer from '@/shared/ui/layout/page-container';

export default function OverViewLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>{children}</div>
    </PageContainer>
  );
}
