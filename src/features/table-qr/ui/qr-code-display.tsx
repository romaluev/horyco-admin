'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { useTableById } from '@/entities/table'


interface IQRCodeDisplayProps {
  tableId: number
  tableNumber: number
}

export const QRCodeDisplay = ({
  tableId,
  tableNumber,
}: IQRCodeDisplayProps) => {
  const { data: table } = useTableById(tableId)

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>QR Code - Table {tableNumber}</CardTitle>
        <CardDescription>
          QR code for customer orders
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {table?.qrCodeUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={table.qrCodeUrl}
              alt={`QR code for table ${tableNumber}`}
              className="h-64 w-64 object-contain"
            />
            <p className="text-sm text-muted-foreground">
              Code: {table.qrCode}
            </p>
          </div>
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded border border-dashed">
            <p className="text-sm text-muted-foreground">
              QR code will be generated automatically
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
