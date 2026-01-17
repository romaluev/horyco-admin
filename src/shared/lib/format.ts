export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('ru-RU', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date))
  } catch (_err) {
    return ''
  }
}

interface IFormatPriceOptions {
  short?: boolean
  currency?: boolean
}

export function formatPrice(amount: number, options?: IFormatPriceOptions): string {
  const { short = false, currency = true } = options ?? {}

  if (short) {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1) + 'B' + (currency ? ' UZS' : '')
    }
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1) + 'M' + (currency ? ' UZS' : '')
    }
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(0) + 'K' + (currency ? ' UZS' : '')
    }
  }

  const formatted = new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return currency ? formatted + ' UZS' : formatted
}

/**
 * Format currency value in UZS with proper locale
 * Cached formatter for performance (per Vercel best practices 7.4)
 */
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'UZS',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/**
 * Format currency with compact notation for large values
 */
const compactCurrencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'UZS',
  maximumFractionDigits: 0,
  notation: 'compact',
})

export function formatCurrencyCompact(value: number): string {
  return compactCurrencyFormatter.format(value)
}
