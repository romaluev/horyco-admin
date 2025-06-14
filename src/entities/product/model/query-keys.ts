export const productKeys = {
  all: () => ['products'],
  byId: (id: number) => ['products', id],
  productTypes: () => ['products-types']
} as const;
