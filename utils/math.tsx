export const calculateTraitRarityScore = (
  traitWeight: number,
  traitsTotalWeight: number,
  collectionTotalSupply: number
): number => {
  return (
    collectionTotalSupply /
    calculateTraitQuantityInCollection(
      traitWeight,
      traitsTotalWeight,
      collectionTotalSupply
    )
  )
}

export const calculateTraitRarityPercentage = (
  traitWeight: number,
  traitsTotalWeight: number
): number => {
  return (traitWeight / traitsTotalWeight) * 100
}

export const calculateTraitQuantityInCollection = (
  traitWeight: number,
  traitsTotalWeight: number,
  collectionTotalSupply: number
): number => {
  return (collectionTotalSupply * traitWeight) / traitsTotalWeight
}

export const calculateTraitRarityFromQuantity = (
  quantity: number,
  traitsTotalWeight: number,
  collectionTotalSupply: number
): number => {
  return collectionTotalSupply / (quantity * traitsTotalWeight)
}
