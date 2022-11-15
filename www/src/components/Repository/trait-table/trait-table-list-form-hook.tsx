import { TraitElementWithImage } from '@hooks/query/useQueryRepositoryLayer'
import { sumByBig } from '@utils/object-utils'
import Big from 'big.js'
import { useForm } from 'react-hook-form'

/** Note, we use big.js's Big to ensure precision. Javascript just sux tbh. */
export const WEIGHT_STEP_COUNT = Big(1)
export const WEIGHT_LOWER_BOUNDARY = Big(0)
export const WEIGHT_UPPER_BOUNDARY = Big(100)

export type TraitElementFields = {
  checked: boolean
  locked: boolean
  weight: Big
  id: string
  name: string
  layerElementId: string
  createdAt: Date
  updatedAt: Date
  readonly: boolean
  imageUrl: string
}

export type TraitElementRarityFormType = {
  traitElements: TraitElementFields[]
  allCheckboxesChecked: boolean
}

export const useTraitElementForm = ({
  traitElements,
  onChange,
}: {
  traitElements: TraitElementWithImage[]
  onChange: () => void
}) => {
  /**
   * Table data based on react-hook-form
   * Handles default values in the table, and any hooks needed for the table.
   * Use the default value to add more functionality into the form.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
    ...props
  } = useForm<TraitElementRarityFormType>({
    defaultValues: {
      allCheckboxesChecked: false,
      traitElements: [...traitElements].map((x) => ({
        id: x.id,
        name: x.name,
        checked: false,
        locked: false,
        weight: Big(x.weight),
        layerElementId: x.layerElementId,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt,
        readonly: x.readonly,
        imageUrl: x.imageUrl,
      })),
    },
  })

  /**
   * Checks if its possible to still distribute
   */
  const isIncreaseRarityPossible = (index: number) => {
    const traitElements = getValues().traitElements
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const none = Big(getValues(`traitElements.${0}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)

    // checks the max boundary
    const maxCheck = weight.eq(WEIGHT_UPPER_BOUNDARY)

    // checks the None trait can be distribute to if locked
    const lockCheck = locked && none.eq(WEIGHT_LOWER_BOUNDARY)

    // checks if there is there is leftover weight to consume
    // @todo fix this
    // const lockedTraitElements = traitElements.filter((x) => !x.locked).filter((_, i) => i !== index)
    // const leftoverCheck = Big(
    //   sumByBig(lockedTraitElements, (x) => x.weight).minus(WEIGHT_STEP_COUNT.mul(lockedTraitElements.length))
    // ).lte(0)
    return lockCheck || maxCheck
  }

  const isDecreaseRarityPossible = (index: number) => {
    const traitElements = getValues().traitElements
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const none = Big(getValues(`traitElements.${0}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)

    // checks the max boundary
    const minCheck = weight.eq(WEIGHT_LOWER_BOUNDARY)

    // checks the None trait can be distribute to if locked
    const lockCheck = locked && none.eq(WEIGHT_UPPER_BOUNDARY)

    // checks if there is there is leftover weight to consume
    // @todo fix this
    // const lockedTraitElements = traitElements.filter((x) => !x.locked).filter((_, i) => i !== index)
    // const leftoverCheck = Big(
    //   sumByBig(lockedTraitElements, (x) => x.weight).minus(WEIGHT_STEP_COUNT.mul(lockedTraitElements.length))
    // ).lte(0)
    return lockCheck || minCheck
  }

  const getMaxGrowthAllowance = (index: number, locked: boolean): Big => {
    return Big(
      locked
        ? WEIGHT_UPPER_BOUNDARY.minus(
            sumByBig(
              getValues().traitElements.filter((_, i) => !(i === 0 || i === index)),
              (x) => x.weight
            )
          )
        : WEIGHT_UPPER_BOUNDARY.minus(
            sumByBig(
              getValues().traitElements.filter((x) => x.locked),
              (x) => x.weight
            )
          )
    )
  }

  const getMinGrowthAllowance = (index: number, locked: boolean): Big => {
    return Big(
      locked
        ? WEIGHT_LOWER_BOUNDARY.plus(
            sumByBig(
              getValues().traitElements.filter((x, i) => x.locked && i !== index),
              (x) => x.weight
            )
          )
        : WEIGHT_LOWER_BOUNDARY
    )
  }

  const isEqual = (a: Big, b: Big) => {
    return a.eq(b)
  }

  const getAllowableIncrementGrowth = (weight: Big, max: Big): Big => {
    /** Figure out how much to change */
    let weightToChange = WEIGHT_STEP_COUNT
    if (weight.plus(weightToChange).gt(max)) {
      weightToChange = max.minus(weight)
    }
    return weightToChange
  }

  const getAllowableDecrementGrowth = (weight: Big, min: Big): Big => {
    /** Figure out how much to change */
    let weightToChange = WEIGHT_STEP_COUNT
    if (weight.minus(weightToChange).lt(min)) {
      weightToChange = min.plus(weight)
    }
    return weightToChange
  }

  const gt = (a: Big, b: Big): boolean => {
    return Big(a).gt(b)
  }

  const lt = (a: Big, b: Big): boolean => {
    return Big(a).lt(b)
  }

  const decrementRarityByIndex = (index: number) => {
    /** Get latest values for the form */
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)
    const id = getValues(`traitElements.${index}.id`)
    const traitElements = getValues().traitElements
    const alterableTraitElements = traitElements
      .filter((x) => x.id !== id) // remove the current trait element
      .filter((x) => !x.locked) // remove the locked trait elements
      .filter((x) => !Big(x.weight).eq(WEIGHT_LOWER_BOUNDARY)) // remove the trait elements that has reached lower boundary

    /** Get min the rarity can grow to */
    const min = getMinGrowthAllowance(index, locked)
    const max = getMaxGrowthAllowance(index, locked)

    /** If has reached upper boundary max, return */
    if (isEqual(weight, min)) return

    /** Figure out how much to change */
    const growth = getAllowableDecrementGrowth(weight, min)
    /** Set the primary weight */
    setValue(`traitElements.${index}.weight`, weight.minus(growth))
    onChange && onChange()

    /**
     * Locked Distribution
     * If locked then dont distribute linearly, only to none trait (index 0)
     * @future also distribute to any other locked traits
     */
    if (locked) {
      setValue(`traitElements.${0}.weight`, Big(getValues(`traitElements.${0}.weight`)).plus(growth))
      return
    }

    /**
     * Non Locked Distribution
     * This algorithm linearly distributes based how big of a slice each traitElement can consume of "growth"
     * Imagine a pie chart, where each traitElement is a slice of the pie. The size of the slice is based on the
     * weight of the traitElement. The bigger the slice, the more it can consume of the growth.
     *
     * @notes by jeevan, I've explored several algorithms, and this one seems to be the most simple solution while
     *        also linearly distributing in a way that makes sense.
     *        Other solutions, I've explored are such that one would reduce everything at the same rate (or amount),
     *        but this would mean that smaller values would hit 0 before others. That is not linear.
     */
    const sum = sumByBig(alterableTraitElements, (x) => x.weight)
    if (sum.eq(0)) return // error handling
    traitElements.forEach((x, index) => {
      if (x.id === id) return
      if (x.locked) return
      const w = Big(x.weight)
      const size = w.div(sum).mul(growth).div(WEIGHT_STEP_COUNT) // the percentage of growth this traitElement can consume
      const linear = growth.mul(size)
      gt(w.plus(linear), max)
        ? setValue(`traitElements.${index}.weight`, max)
        : setValue(`traitElements.${index}.weight`, w.plus(linear))
    })
  }

  const incrementRarityByIndex = (index: number) => {
    /** Get latest values for the form */
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)
    const id = getValues(`traitElements.${index}.id`)
    const traitElements = getValues().traitElements
    const alterableTraitElements = traitElements
      .filter((x) => x.id !== id) // remove the current trait element
      .filter((x) => !x.locked) // remove the locked trait elements
      .filter((x) => !Big(x.weight).eq(WEIGHT_LOWER_BOUNDARY)) // remove the trait elements that has reached lower boundary

    /** Get max the rarity can grow to */
    const max = getMaxGrowthAllowance(index, locked)
    const min = getMinGrowthAllowance(index, locked)

    /** If has reached upper boundary max, return */
    if (isEqual(weight, max)) return

    /** Figure out how much to change */
    const growth = getAllowableIncrementGrowth(weight, max)

    /** Set the primary weight */
    setValue(`traitElements.${index}.weight`, weight.plus(growth))
    onChange && onChange()

    /**
     * Locked Distribution
     * If locked then dont distribute linearly, only to none trait (index 0)
     * @future also distribute to any other locked traits
     */
    if (locked) {
      setValue(`traitElements.${0}.weight`, Big(getValues(`traitElements.${0}.weight`)).minus(growth))
      return
    }

    /**
     * Non Locked Distribution
     * This algorithm linearly distributes based how big of a slice each traitElement can consume of "growth"
     * Imagine a pie chart, where each traitElement is a slice of the pie. The size of the slice is based on the
     * weight of the traitElement. The bigger the slice, the more it can consume of the growth.
     *
     * @notes by jeevan, I've explored several algorithms, and this one seems to be the most simple solution while
     *        also linearly distributing in a way that makes sense.
     *        Other solutions, I've explored are such that one would reduce everything at the same rate (or amount),
     *        but this would mean that smaller values would hit 0 before others. That is not linear.
     */
    const sum = sumByBig(alterableTraitElements, (x) => x.weight)
    traitElements.forEach((x, index) => {
      if (x.id === id) return
      if (x.locked) return
      const w = Big(x.weight)
      const size = w.div(sum).mul(growth).div(WEIGHT_STEP_COUNT) // the percentage of growth this traitElement can consume
      const linear = growth.mul(size)
      lt(w.minus(linear), min)
        ? setValue(`traitElements.${index}.weight`, min)
        : setValue(`traitElements.${index}.weight`, w.minus(linear))
    })
  }

  const isNoneTraitElement = (index: number) => {
    return getValues(`traitElements.${index}.readonly`)
  }

  return {
    incrementRarityByIndex,
    decrementRarityByIndex,
    isIncreaseRarityPossible,
    isDecreaseRarityPossible,
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    isNoneTraitElement,
    formState: { errors },
    ...props,
  }
}
