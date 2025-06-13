export const productKeys = {
  all: () => ['products'],
  byId: (id: number) => ['products', id],
  productTypes: () => ['product-types']
} as const;
