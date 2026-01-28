export interface ParsedCsvRow {
  [key: string]: string
}

export interface CsvParseResult {
  data: ParsedCsvRow[]
  errors: string[]
}

export const parseCsv = (file: File): Promise<CsvParseResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result
      if (!text || typeof text !== 'string') {
        resolve({ data: [], errors: ['Ошибка чтения файла'] })
        return
      }

      const lines = text.split('\n').filter((line) => line.trim())

      if (lines.length === 0) {
        resolve({ data: [], errors: ['CSV файл пустой'] })
        return
      }

      const headerLine = lines[0]
      if (!headerLine) {
        resolve({ data: [], errors: ['Заголовки не найдены'] })
        return
      }

      const headers = headerLine.split(',').map((h) => h.trim())
      const data: ParsedCsvRow[] = []
      const errors: string[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (!line) continue

        const values = line.split(',').map((v) => v.trim())
        if (values.length !== headers.length) {
          errors.push(`Строка ${i + 1}: неверное количество колонок`)
          continue
        }

        const row: ParsedCsvRow = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }

      resolve({ data, errors })
    }

    reader.onerror = () => {
      resolve({ data: [], errors: ['Ошибка чтения файла'] })
    }

    reader.readAsText(file)
  })
}
