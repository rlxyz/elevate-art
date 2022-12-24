import type { TraitElementWithImage } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import Big from 'big.js'
import { useForm } from 'react-hook-form'
import { sumByBig } from 'src/shared/object-utils'

/** Note, we use big.js's Big to ensure precision. Javascript just sux tbh. */
export const WEIGHT_STEP_COUNT = Big(0.0001)
export const WEIGHT_LOWER_BOUNDARY = Big(0)
export const WEIGHT_UPPER_BOUNDARY = Big(100)

//! super hacky way to simulate a sigmoid function. lol. unfortunately, big.js doesn't have exp() or log() functions. rip.
//! unless I convert everything to decimal.js, but that's a lot of work. till next time.
export const WEIGHT_STEP_COUNT_RANGES = [
  Big(0.0001),
  Big(0.0001),
  Big(0.0001),
  Big(0.0002),
  Big(0.0005),
  Big(0.001),
  Big(0.002),
  Big(0.005),
  Big(0.01),
  Big(0.02),
  Big(0.05),
  Big(0.1),
  Big(0.15),
  Big(0.2),
  Big(0.25),
  Big(0.3),
  Big(0.35),
  Big(0.4),
  Big(0.45),
  Big(0.5),
  Big(0.55),
  Big(0.6),
  Big(0.65),
  Big(0.7),
  Big(0.75),
  Big(0.8),
  Big(0.85),
  Big(0.9),
  Big(0.95),
  Big(1),
]

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

export const useTraitElementForm = ({ traitElements, onChange }: { traitElements: TraitElementWithImage[]; onChange: () => void }) => {
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

    // check if any unlocked traits to consume
    const leftoverCheck = sumByBig(
      traitElements.filter((x) => !x.locked).filter((_, i) => i !== index),
      (x) => x.weight
    ).gt(0)

    return lockCheck || maxCheck || !leftoverCheck
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
    const leftoverCheck = sumByBig(
      traitElements.filter((x) => !x.locked).filter((_, i) => i !== index),
      (x) => x.weight
    ).gt(0)

    // const lockedTraitElements = traitElements.filter((x) => !x.locked).filter((_, i) => i !== index)
    // const leftoverCheck = Big(
    //   sumByBig(lockedTraitElements, (x) => x.weight).minus(WEIGHT_STEP_COUNT.mul(lockedTraitElements.length))
    // ).lte(0)
    return lockCheck || minCheck || !leftoverCheck
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

  const getAllowableIncrementGrowth = (weight: Big, max: Big, change: Big): Big => {
    /** Figure out how much to change */
    let weightToChange = change
    if (weight.plus(weightToChange).gt(max)) {
      weightToChange = max.minus(weight)
    }
    return weightToChange
  }

  const getAllowableDecrementGrowth = (weight: Big, min: Big, change: Big): Big => {
    /** Figure out how much to change */
    let weightToChange = change
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

  const decrementRarityByIndex = (index: number, change: Big) => {
    /** Get latest values for the form */
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)
    const id = getValues(`traitElements.${index}.id`)
    const traitElements = getValues().traitElements
    const alterableTraitElements = traitElements
      .filter((x) => x.id !== id) // remove the current trait element
      .filter((x) => !x.locked) // remove the locked trait elements
      .filter((x) => !Big(x.weight).eq(WEIGHT_LOWER_BOUNDARY)) // remove the trait elements that has reached lower boundary

    /** Nothing to alter */
    if (alterableTraitElements.length === 0) return

    /** Get min the rarity can grow to */
    const min = getMinGrowthAllowance(index, locked)
    const max = getMaxGrowthAllowance(index, locked)

    /** If has reached upper boundary max, return */
    if (isEqual(weight, min)) return

    /** Figure out how much to change */
    const growth = getAllowableDecrementGrowth(weight, min, change)

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
     *
     * @todo ensure invariant is equal; before and after summation is almost equal with some error boundary
     * Use this to debug the algorithm
     *
     * // top of algo
     * let sizes: Big[] = []
     * let linears: Big[] = []
     *
     * // inside loop
     * sizes.push(size), linears.push(linear)
     *
     * // outside algo
     * console.log({
     *    arr: sizes.map((x) => x.toNumber()),
     *    sum: sumByBig(sizes, (x) => x).toNumber(),
     *    linear: linears.map((x) => x.toNumber()),
     *    lsum: sumByBig(linears, (x) => x).toNumber(),
     *    growth: growth.toNumber(),
     * })
     */
    const sum = sumByBig(alterableTraitElements, (x) => x.weight)
    if (sum.eq(0)) return // error handling

    traitElements.forEach((x, index) => {
      if (x.id === id) return
      if (x.locked) return
      const w = Big(x.weight)
      const size = w.div(sum)
      const linear = growth.mul(size)
      gt(w.plus(linear), max) ? setValue(`traitElements.${index}.weight`, max) : setValue(`traitElements.${index}.weight`, w.plus(linear))
    })
  }

  const incrementRarityByIndex = (index: number, change: Big) => {
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
    const growth = getAllowableIncrementGrowth(weight, max, change)

    /** Set the primary weight */
    setValue(`traitElements.${index}.weight`, weight.plus(growth))
    onChange && onChange()

    /** If any is 100, everything else is 0 */
    if (isEqual(Big(getValues(`traitElements.${index}.weight`)), WEIGHT_UPPER_BOUNDARY)) {
      traitElements.forEach((x, i) => {
        if (x.id === id) return
        setValue(`traitElements.${i}.weight`, WEIGHT_LOWER_BOUNDARY)
      })
      return
    }

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
     *
     * // top of algo
     * let sizes: Big[] = []
     * let linears: Big[] = []
     *
     * // inside loop
     * sizes.push(size), linears.push(linear)
     *
     * // outside algo
     * console.log({
     *    arr: sizes.map((x) => x.toNumber()),
     *    sum: sumByBig(sizes, (x) => x).toNumber(),
     *    linear: linears.map((x) => x.toNumber()),
     *    lsum: sumByBig(linears, (x) => x).toNumber(),
     *    growth: growth.toNumber(),
     * })
     */
    const sum = sumByBig(alterableTraitElements, (x) => x.weight)
    traitElements.forEach((x, index) => {
      if (x.id === id) return
      if (x.locked) return
      const w = Big(x.weight)
      const size = w.div(sum)
      const linear = growth.mul(size)
      lt(w.minus(linear), min) ? setValue(`traitElements.${index}.weight`, min) : setValue(`traitElements.${index}.weight`, w.minus(linear))
    })
  }

  const isNoneTraitElement = (index: number) => {
    return getValues(`traitElements.${index}.readonly`)
  }

  const randomiseValues = () => {
    randomFill(getValues(`traitElements`).length, 0.2, 0.5).forEach((value, index) => {
      setValue(`traitElements.${index}.weight`, Big(value).times(100))
    })
    onChange && onChange()
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
    randomiseValues,
    getValues,
    setValue,
    isNoneTraitElement,
    formState: { errors },
    ...props,
  }
}

const random = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

const randomFill = (amount: number, min: number, max: number) => {
  const arr: number[] = []
  let total = 0

  // fill an array with random numbers
  for (let i = 0; i < amount; i++) arr.push(random(min, max))

  // add up all the numbers
  for (let i = 0; i < amount; i++) total += arr[i] || 0

  // normalise so numbers add up to 1
  for (let i = 0; i < amount; i++) arr[i] /= total

  return arr
}
