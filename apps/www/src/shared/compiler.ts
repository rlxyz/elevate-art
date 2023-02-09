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
  name: z.string().optional(),
  weight: z.number(),
  rules: z.array(Rule),
})

export const Layer = z.object({
  id: z.string(),
  name: z.string().optional(),
  priority: z.number(),
  traits: z.array(Trait),
})

export const Rarity = z.object({
  index: z.number(),
  score: z.number(),
  rank: z.number(),
})

export type Layer = z.infer<typeof Layer>
export type Trait = z.infer<typeof Trait>
export type Rule = z.infer<typeof Rule>
export type Rarity = z.infer<typeof Rarity>

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
  return traits.reduce((acc: Trait[], { rules, id, weight, name }: Trait) => {
    const exclude = rules.filter((rule) => rule.type === RulesEnum.enum['cannot mix with'] && elements.map((x) => x[1]).includes(rule.with))
    return [...acc, ...(exclude.length === 0 ? [{ id, rules, weight, name }] : [])]
  }, [])
}

const combination = (elements: [string, string][], traits: Trait[]): Trait[] => {
  // if (elements.length === 2) {
  //   console.log('3', elements)
  // }

  const all = traits.reduce((acc: Trait[], { rules, id, weight, name }: Trait) => {
    // if (elements.length === 2 && id === 'cld95y2480001kv08f30basyn') {
    //   console.log(
    //     'found',
    //     id,
    //     name,
    //     rules.filter((rule) => rule.type === RulesEnum.enum['only mixes with'] && elements.map((x) => x[1]).includes(rule.with))
    //   )
    // }
    const combine = rules.filter((rule) => rule.type === RulesEnum.enum['only mixes with'] && elements.map((x) => x[1]).includes(rule.with))
    return [...acc, ...(combine.length > 0 ? [{ id, rules, name, weight }] : [])]
  }, [])

  // if (elements.length === 2) {
  //   console.log('all', traits, all)
  // }

  return all
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

    // step 1.3: if no excludes but has combinations, means, edge case where the next elements are not allowed to be mixed with one of the current element
    if (excludes.length === 0 && combinations.length > 0) {
      const remove = combinations
        .map((x) => x)
        .flatMap((x) => x.rules)
        .filter((x) => x.type === RulesEnum.enum['only mixes with'])
        .map((x) => x.with)
        .filter((x) => elements.map((x) => x[1]).includes(x))

      elements.splice(
        elements.findIndex((x) => x[1] === remove[0]),
        1
      )
    } else {
      // step 1.3: choose next element
      const next = choose(excludes, random)

      // step 2: find the next element
      elements.push([id, next])
    }
  })

  // ret
  return elements.reverse()
}

export const many = (layers: Layer[], seeds: string[]): [string, string][][] => {
  const sorted = layers.map((x) => ({ ...x, traits: x.traits.sort((a, b) => b.weight - a.weight) })).sort((a, b) => a.priority - b.priority)
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
export const rarity = (elements: [string, string][][]): Rarity[] => {
  const occurs = occurances.traits(elements)
  const max = elements.length
  return elements
    .map((token, index) => ({
      index,
      score: token.reduce((result, [_, traitElementId]) => result - Math.log((occurs.get(traitElementId) || 1) / max), 0 as number),
    }))
    .sort((a, b) => b.score - a.score)
    .map((x, i) => ({ ...x, rank: i + 1 }))
}

export const seed = (...values: (string | number)[]) => {
  return values.join('.')
}

// @todo keccak256 hash
export const hash = (elements: [string, string][]) => {
  return elements.join('.')
}
