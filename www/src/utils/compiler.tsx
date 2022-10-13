//////////////////////////////////////////////////////////////////////////////////////////
// compiler                                                                         //
// a general purpose compiler for layering images with traits and rules                 //
//                                                                                      //
// @todo move to its own repo                                                           //
// @todo remove seedrandom & implement own randomness                                   //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
import seedrandom from 'seedrandom'
import { z } from 'zod'

export const RulesEnum = z.enum(['cannot mix with', 'only mixes with'])
export type RulesType = z.infer<typeof RulesEnum>

export const Rule = z.object({
  type: RulesEnum,
  with: z.string(),
})

export const Trait = z.object({
  id: z.string(),
  weight: z.number(),
  rules: z.array(Rule),
})

export const Layer = z.object({
  id: z.string(),
  priority: z.number(),
  traits: z.array(Trait),
})

export type Layer = z.infer<typeof Layer>
export type Trait = z.infer<typeof Trait>
export type Rule = z.infer<typeof Rule>

export const parseLayer = <T extends Layer>(layers: Array<T>): Layer[] => {
  return layers.map(({ id, traits, priority }) =>
    Layer.parse({
      id,
      priority,
      traits: traits.map(({ id, weight, rules }) =>
        Trait.parse({
          id,
          weight,
          rules,
        })
      ),
    })
  )
}

const exclude = (elements: [string, string][], traits: Trait[]): Trait[] => {
  return traits.reduce((acc: Trait[], { rules, id, weight }: Trait) => {
    const exclude = rules.filter(
      (rule) => rule.type === RulesEnum.enum['cannot mix with'] && elements.map((x) => x[1]).includes(rule.with)
    )
    return [...acc, ...(exclude.length === 0 ? [{ id, rules, weight }] : [])]
  }, [])
}

const combination = (elements: [string, string][], traits: Trait[]): Trait[] => {
  return traits.reduce((acc: Trait[], { rules, id, weight }: Trait) => {
    const combine = rules.filter(
      (rule) => rule.type === RulesEnum.enum['only mixes with'] && elements.map((x) => x[1]).includes(rule.with)
    )
    return [...acc, ...(combine.length > 0 ? [{ id, rules, weight }] : [])]
  }, [])
}

const choose = (traits: Trait[], random: seedrandom.PRNG): string => {
  let element = ''
  let r = random() * traits.reduce((a, b) => a + b.weight, 0)
  traits.every(({ id, weight }: Trait) => {
    r -= weight
    if (r < 0) {
      element = id
      return false
    }
    return true
  })
  return element
}

export const one = (layers: Layer[], seed: string): [string, string][] => {
  // step -2: create high-level seed
  const random = seedrandom(seed)

  // step -1: create element ids
  const elements: [string, string][] = []

  // step 0: iterate all layers
  layers.forEach(({ id, traits }) => {
    // step 1.1: grab combinations that can happen
    const combinations = combination(elements, traits)

    // step 1.2: grab exclusion filtered tokens
    const excludes = exclude(elements, combinations.length > 0 ? combinations : traits)

    // step 2: find the next element
    elements.push([id, choose(excludes, random)])
  })

  // ret
  return elements.reverse()
}

export const many = (layers: Layer[], seeds: string[]): [string, string][][] => {
  const sorted = layers
    .map((x) => ({ ...x, traits: x.traits.sort((a, b) => a.weight - b.weight) }))
    .sort((a, b) => a.priority - b.priority)
  return seeds.map((x) => one(sorted, x))
}

export const occurances = {
  tokens: (elements: [string, string][][]): Map<string, Map<string, number[]>> => {
    const occurance = new Map<string, Map<string, number[]>>()
    elements.forEach((x, i) => {
      x.forEach((x) => {
        occurance.get(x[0]) || occurance.set(x[0], new Map<string, number[]>()),
          occurance.get(x[0])?.get(x[1])
            ? occurance.get(x[0])?.set(x[1], [...(occurance.get(x[0])?.get(x[1]) || []), i])
            : occurance.get(x[0])?.set(x[1], [i])
      })
    })
    return occurance
  },
  traits: (elements: [string, string][][]): Map<string, number> => {
    const occurance = new Map<string, number>()
    elements.flatMap((x) => x).forEach((x) => occurance.set(x[1], (occurance.get(x[1]) || 0) + 1))
    return occurance
  },
}

// returns rarity score
// based on openrarity
export const rarity = (
  elements: [string, string][][]
): {
  index: number
  score: number
}[] => {
  const max = elements.length
  const occurs = occurances.traits(elements)
  return elements
    .map((token, index) => {
      return {
        index,
        score: token.reduce((result, item) => {
          return result - Math.log((occurs.get(item[1]) || 0) / max)
        }, 0),
      }
    })
    .sort((a, b) => {
      return b.score - a.score
    })
}

export const seed = (...values: (string | number)[]) => {
  return values.join('.')
}

// @todo keccak256 hash
export const hash = (elements: [string, string][]) => {
  return elements.join('.')
}
