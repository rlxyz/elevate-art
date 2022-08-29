import * as z from 'zod'

const LayerSection = Object.freeze({
  Preview: 'preview',
  Layers: 'layers',
  Rarity: 'rarity',
  Rules: 'rules',
})

export const LayerSectionEnum = z.nativeEnum(LayerSection)
export type LayerSectionType = z.infer<typeof LayerSectionEnum>

const Rules = Object.freeze({
  'cannot mix with': 'cannot mix with',
  'only mixes with': 'only mixes with',
})

export const RulesEnum = z.nativeEnum(Rules)
export type RulesType = z.infer<typeof RulesEnum>
