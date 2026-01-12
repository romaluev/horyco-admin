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
