export function getChangedAdditions(
  initial: any[] = [],
  current: any[] = [],
  productId: number
): any[] {
  const result: any[] = [];

  current.forEach((currentAddition: any) => {
    if (!currentAddition.id) {
      result.push({ ...currentAddition, productId });
      return;
    }

    const originalAddition = initial.find((a: any) => a.id === currentAddition.id);
    if (!originalAddition) return;

    const hasMainChanges =
      currentAddition.name !== originalAddition.name ||
      currentAddition.isRequired !== originalAddition.isRequired ||
      currentAddition.isMultiple !== originalAddition.isMultiple ||
      currentAddition.limit !== originalAddition.limit;

    const changedProducts: any[] = [];

    (currentAddition.additionProducts || []).forEach((currentProduct: any) => {
      if (!currentProduct.id) {
        if (currentAddition.id) {
          currentProduct.additionId = currentAddition.id;
        }
        changedProducts.push(currentProduct);
        return;
      }

      const originalProduct = originalAddition.additionProducts.find(
        (p: any) => p.id === currentProduct.id
      );
      if (!originalProduct) return;

      if (
        currentProduct.name !== originalProduct.name ||
        currentProduct.price !== originalProduct.price
      ) {
        changedProducts.push(currentProduct);
      }
    });

    originalAddition.additionProducts.forEach((originalProduct: any) => {
      if (!originalProduct.id) return;

      const isDeleted = !(currentAddition.additionProducts || []).some(
        (p: any) => p.id === originalProduct.id
      );
      if (isDeleted) {
        changedProducts.push({ ...originalProduct, isDeleted: true });
      }
    });

    if (hasMainChanges || changedProducts.length) {
      result.push({
        ...currentAddition,
        productId,
        additionProducts: changedProducts.length ? changedProducts : undefined
      });
    }
  });

  // Handle deleted additions
  initial.forEach((originalAddition: any) => {
    if (!originalAddition.id) return;

    const isDeleted = !current.some((a: any) => a.id === originalAddition.id);
    if (isDeleted) {
      result.push({
        ...originalAddition,
        productId,
        isDeleted: true
      });
    }
  });

  return result;
}
