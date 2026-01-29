'use client'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { InvoicesList } from './invoices-list'
import { ModuleCatalog } from './module-catalog'
import { PaymentsHistory } from './payments-history'
import { SubscriptionDashboard } from './subscription-dashboard'

export const SubscriptionPage = () => {
  return (
    <PageContainer scrollable>
      <div className="w-full space-y-8">
        <div>
          <Heading
            title="Управление подпиской"
            description="Просмотр статуса подписки, управление модулями, счетами и платежами"
          />
        </div>
        <Separator />

        {/* Subscription Overview Section */}
        <section className="space-y-4">
          <h2 className="text-xl leading-none font-semibold">
            Статус подписки
          </h2>
          <SubscriptionDashboard />
        </section>

        <Separator />

        {/* Module Catalog Section */}
        <section className="space-y-4">
          <h2 className="text-xl leading-none font-semibold">
            Доступные модули
          </h2>
          <p className="text-muted-foreground text-sm">
            Добавляйте или удаляйте модули из вашей подписки. Новые модули
            доступны с 7-дневным пробным периодом.
          </p>
          <ModuleCatalog />
        </section>

        <Separator />

        {/* Invoices Section */}
        <section className="space-y-4">
          <h2 className="text-xl leading-none font-semibold">Счета-фактуры</h2>
          <p className="text-muted-foreground text-sm">
            История ваших счетов и квитанций
          </p>
          <InvoicesList />
        </section>

        <Separator />

        {/* Payments Section */}
        <section className="space-y-4">
          <h2 className="text-xl leading-none font-semibold">
            История платежей
          </h2>
          <p className="text-muted-foreground text-sm">
            Запись всех произведенных платежей
          </p>
          <PaymentsHistory />
        </section>
      </div>
    </PageContainer>
  )
}
