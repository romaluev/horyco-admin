import { PropertyMetadata } from '@/shared/lib/table-params';

/**
 * Branch properties for filtering and sorting
 */
export const branchProperties: PropertyMetadata[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    sortable: true,
    filterable: true
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    sortable: true,
    filterable: true
  },
  {
    key: 'createdAt',
    label: 'Created At',
    type: 'date',
    sortable: true,
    filterable: true
  }
];
