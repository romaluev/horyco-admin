import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Armchair } from 'lucide-react';
import { ITable } from '../model';

type TableCardProps = {
  table: ITable;
  className?: string;
  UpdateButton?: React.ComponentType<{ id: number }>;
  DeleteButton?: React.ComponentType<{ id: number }>;
};
export const TableCard = ({
  table,
  className,
  UpdateButton,
  DeleteButton
}: TableCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className='grid-rows-1 items-center'>
        <CardTitle>Стол: #{table.number}</CardTitle>
        <CardAction className='row-span-1 grid grid-cols-2 gap-2'>
          {UpdateButton && <UpdateButton id={table.id} />}
          {DeleteButton && <DeleteButton id={table.id} />}
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p className='text-md flex items-center gap-1'>
            <Armchair size={18} />
            Количество мест: <strong>{table.size}</strong>
          </p>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
