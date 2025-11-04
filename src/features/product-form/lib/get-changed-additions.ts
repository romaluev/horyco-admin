export function getChangedAdditions(
  initial: Array<Record<string, unknown>> = [],
  current: Array<Record<string, unknown>> = [],
  productId: number
): Array<Record<string, unknown>> {
  const result: Array<Record<string, unknown>> = []

  current.forEach((currentAddition: Record<string, unknown>) => {
    if (!(currentAddition as Record<string, unknown>).id) {
      result.push({ ...currentAddition, productId })
      return
    }

    const originalAddition = initial.find(
      (a: Record<string, unknown>) => a.id === currentAddition.id
    )
    if (!originalAddition) return

    const hasMainChanges =
      currentAddition.name !== originalAddition.name ||
      currentAddition.isRequired !== originalAddition.isRequired ||
      currentAddition.isMultiple !== originalAddition.isMultiple ||
      currentAddition.limit !== originalAddition.limit

    const changedProducts: any[] = []

    const additionProducts = Array.isArray(currentAddition.additionProducts) ? (currentAddition.additionProducts as Array<Record<string, unknown>>) : []
    additionProducts.forEach(
      (currentProduct: Record<string, unknown>) => {
        if (!currentProduct.id) {
          if (currentAddition.id) {
            currentProduct.additionId = currentAddition.id
          }
          changedProducts.push(currentProduct)
          return
        }

        const origProducts = Array.isArray(originalAddition.additionProducts) ? (originalAddition.additionProducts as Array<Record<string, unknown>>) : []
        const originalProduct = origProducts.find(
          (p: Record<string, unknown>) => p.id === currentProduct.id
        )
        if (!originalProduct) return

        if (
          currentProduct.name !== originalProduct.name ||
          currentProduct.price !== originalProduct.price
        ) {
          changedProducts.push(currentProduct)
        }
      }
    )

    const origAdditionProducts = Array.isArray(originalAddition.additionProducts) ? (originalAddition.additionProducts as Array<Record<string, unknown>>) : []
    origAdditionProducts.forEach((originalProduct: Record<string, unknown>) => {
      if (!originalProduct.id) return

      const currProducts = Array.isArray(currentAddition.additionProducts) ? (currentAddition.additionProducts as Array<Record<string, unknown>>) : []
      const isDeleted = !currProducts.some(
        (p: Record<string, unknown>) => p.id === originalProduct.id
      )
      if (isDeleted) {
        changedProducts.push({ ...originalProduct, isDeleted: true })
      }
    })

    if (hasMainChanges || changedProducts.length) {
      result.push({
        ...currentAddition,
        productId,
        additionProducts: changedProducts.length ? changedProducts : undefined,
      })
    }
  })

  // Handle deleted additions
  initial.forEach((originalAddition: Record<string, unknown>) => {
    if (!originalAddition.id) return

    const isDeleted = !current.some(
      (a: Record<string, unknown>) => a.id === originalAddition.id
    )
    if (isDeleted) {
      result.push({
        ...originalAddition,
        productId,
        isDeleted: true,
      })
    }
  })

  return result
}
