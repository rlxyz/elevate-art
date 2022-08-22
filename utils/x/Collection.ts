import { CollectionAnalyticsType } from './types'

export type ArtCollectionElement = {
  trait_type: string
  value: string
}

export type ArtCollectionToken = { attributes: any; token_hash: string }

export type ArtCollectionAttributeMap = {
  [key: string]: { [key: string]: number }
}

export type ArtCollectionTokenMap = {
  [key: string]: { [key: string]: number[] }
}

class ArtCollection {
  // Header
  username: string
  totalSupply: number

  // Data
  tokens: ArtCollectionToken[]
  filtered: ArtCollectionToken[]

  // Maps
  tokenIdMap: ArtCollectionTokenMap
  attributeMap: ArtCollectionAttributeMap

  constructor({
    tokens,
    data,
    totalSupply,
  }: {
    tokens: any
    data: any
    totalSupply: number
  }) {
    this.tokens = tokens
    this.filtered = tokens
    this.totalSupply = totalSupply
    const { attributeMap, tokenIdMap } = this.createAttributeMappings()
    this.tokenIdMap = tokenIdMap
    this.attributeMap = attributeMap
  }

  getTraitCount = ({ trait_type, value }: ArtCollectionElement) => {
    return this.attributeMap[trait_type][value]
  }

  getTotalSupply = (): number => {
    return this.totalSupply
  }

  // todo: make this faster
  setFilter = (filters: ArtCollectionElement[]): void => {
    let filteredTokenIds: number[] = []
    filters.forEach(({ trait_type, value }: ArtCollectionElement) => {
      filteredTokenIds = [
        ...filteredTokenIds,
        ...(this.tokenIdMap[trait_type][value] || []),
      ]
    })
    filteredTokenIds = filteredTokenIds
      .filter((entry, index) => filteredTokenIds.indexOf(entry) === index)
      .sort()
    this.filtered = this.tokens.filter((_, index) =>
      filteredTokenIds.includes(index)
    )
  }

  calculateRarityAttributes = (type: CollectionAnalyticsType) => {
    const traits: any = {}
    for (const { attributes } of this.tokens) {
      for (const { trait_type: type, value } of attributes) {
        !traits[type] && (traits[type] = {})
        !traits[type][value] ? (traits[type][value] = 1) : traits[type][value]++
      }
    }

    let upperBound = 0
    let total = 0
    for (const [_, value] of Object.entries(traits)) {
      for (const [_, entry] of Object.entries(value)) {
        entry > upperBound && (upperBound = entry) // todo: move to own function
        total += entry
      }
    }

    for (const [type, value] of Object.entries(traits)) {
      traits[type] = Object.entries(value)
        // @ts-ignore
        .sort(([, v1], [, v2]) => v1 - v2)
        .reduce(
          (obj, [k, v]) => ({
            ...obj,
            [k]: v,
          }),
          {}
        )
    }

    // todo: modularise this
    switch (type) {
      case 'light':
        return traits
      case 'full':
        // Get Rarity Rating for each type-attribute
        for (const [type, value] of Object.entries(traits)) {
          for (const [attribute, attribute_value] of Object.entries(value)) {
            traits[type][attribute] = {
              value: attribute_value,
              rating: upperBound / attribute_value,
            }
          }
        }

        return traits

      case 'rankings-trait':
        const allTraitsWithRarity = []
        for (const [type, value] of Object.entries(traits)) {
          for (const [attribute, attribute_value] of Object.entries(value)) {
            traits[type][attribute] = {
              value: attribute_value,
              rating: upperBound / attribute_value,
            }
            allTraitsWithRarity.push({
              trait_type: type,
              value: value,
              count: attribute,
              ...traits[type][attribute],
            })
          }
        }

        allTraitsWithRarity.sort(function (a, b) {
          return b.rating - a.rating
        })

        return allTraitsWithRarity

      case 'rankings-token':
        // Get Rarity Rating for each type-attribute
        for (const [type, value] of Object.entries(traits)) {
          for (const [attribute, attribute_value] of Object.entries(value)) {
            traits[type][attribute] = {
              value: attribute_value,
              rating: upperBound / attribute_value,
            }
          }
        }

        const rank = []
        for (let j = 0; j < this.totalSupply; j++) {
          let rarityValue = 0
          for (const item of this.tokens[j]['attributes']) {
            const { trait_type, value } = item
            rarityValue += traits[trait_type][value]['rating']
          }
          rank.push(rarityValue)
        }

        var mapped = rank
          .map(function (el, i) {
            return { token_id: i, rarity: el }
          })
          .sort(function (a, b) {
            return b.rarity - a.rarity
          })

        return {
          rankings: mapped
            .slice(0, 20)
            .map((token: { token_id: number; rarity: number }, index) => {
              const { token_id } = token
              return {
                rank: index + 1,
                header: {
                  token_id: token_id,
                  token_hash: this.tokens[token_id]['token_hash'],
                  image_url: `${process.env.IMAGE_GENERATE_URL}/${this.tokens[token_id]['token_hash']}`,
                  total_rating: token.rarity,
                },
                traits: this.tokens[token_id]['attributes'].map(
                  (attribute: any) => {
                    const { trait_type, value } = attribute
                    return {
                      trait_type: trait_type,
                      value: value,
                      rating: traits[trait_type][value]['rating'],
                    }
                  }
                ),
              }
            }),
        }
      default:
        return traits
    }
  }

  // filterByRanking = (start: number, end: number): ArtCollection => {
  //   const traits: any = {}
  //   for (const item of this.data) {
  //     for (const attributes of item) {
  //       const { trait_type: type, value } = attributes
  //       !traits[type] && (traits[type] = {})
  //       !traits[type][value] ? (traits[type][value] = 1) : traits[type][value]++
  //     }
  //   }

  //   let upperBound = 0
  //   let total = 0
  //   for (const [_, value] of Object.entries(traits)) {
  //     for (const [_, entry] of Object.entries(value)) {
  //       entry > upperBound && (upperBound = entry) // todo: move to own function
  //       total += entry
  //     }
  //   }

  //   for (const [type, value] of Object.entries(traits)) {
  //     traits[type] = Object.entries(value)
  //       // @ts-ignore
  //       .sort(([, v1], [, v2]) => v1 - v2)
  //       .reduce(
  //         (obj, [k, v]) => ({
  //           ...obj,
  //           [k]: v,
  //         }),
  //         {}
  //       )
  //   }

  //   // Get Rarity Rating for each type-attribute
  //   for (const [type, value] of Object.entries(traits)) {
  //     for (const [attribute, attribute_value] of Object.entries(value)) {
  //       traits[type][attribute] = {
  //         value: attribute_value,
  //         rating: upperBound / attribute_value,
  //       }
  //     }
  //   }

  //   const rank = []
  //   for (let j = 0; j < this.totalSupply; j++) {
  //     let rarityValue = 0
  //     for (const item of this.tokens[j]['attributes']) {
  //       const { trait_type, value } = item
  //       rarityValue += traits[trait_type][value]['rating']
  //     }
  //     rank.push(rarityValue)
  //   }

  //   var mapped = rank
  //     .map(function (el, i) {
  //       return { token_id: i, rarity: el }
  //     })
  //     .sort(function (a, b) {
  //       return b.rarity - a.rarity
  //     })

  //   return new ArtCollection({
  //     tokens: mapped
  //       .slice(start, end)
  //       .map((token: { token_id: number; rarity: number }, index) => {
  //         const { token_id } = token
  //         return {
  //           token_hash: this.tokens[token_id]['token_hash'],
  //           attributes: this.tokens[token_id]['attributes'].map(
  //             (attribute: any) => {
  //               const { trait_type, value } = attribute
  //               return {
  //                 trait_type: trait_type,
  //                 value: value,
  //                 rating: traits[trait_type][value]['rating'],
  //               }
  //             }
  //           ),
  //         }
  //       }),
  //     totalSupply: end - start,
  //     data: null,
  //   })
  // }

  createAttributeMappings = () => {
    let tokenIdMap: ArtCollectionTokenMap = {}
    let attributeMap: ArtCollectionAttributeMap = {}

    // iterate each token
    this.tokens.forEach(
      (
        { attributes }: { attributes: ArtCollectionElement[] },
        index: number
      ) => {
        attributes.forEach((attribute: ArtCollectionElement) => {
          // get the trait type and value. e.g Background for t, Blue for v
          const { trait_type: t, value: v } = attribute

          // build maps if they dont exists
          !tokenIdMap[t] && ((tokenIdMap[t] = {}), (attributeMap[t] = {}))

          // update tokenIdMap - push to array
          tokenIdMap[t][v]?.push(index) || (tokenIdMap[t][v] = [index])

          // update attributeMap - increment by 1 each time
          attributeMap[t][v] = attributeMap[t][v] + 1 || 1
        })
      }
    )

    return { tokenIdMap, attributeMap }
  }

  filterByPosition = (
    start: number,
    end: number
  ): { token_hash: string; attributes: any }[] => {
    return this.tokens.slice(start, end)
  }

  filterByAttribute = () => {}
}

export default ArtCollection
