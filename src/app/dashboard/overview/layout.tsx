'use strict'

import React from 'react'

import PageContainer from '@/shared/ui/layout/page-container'

export default function OverViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageContainer>{children}</PageContainer>
}
