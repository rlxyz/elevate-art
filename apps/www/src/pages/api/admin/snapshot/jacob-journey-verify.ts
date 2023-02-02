import type { NextApiRequest, NextApiResponse } from 'next'
import extra from './files/jacob-journey-extra.json'
import json from './files/jacob-journey.json'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const superrare = json.data.all[0]
  const ng_edition_10 = json.data.all[3]
  const reflections = json.data.all[1]

  const extra_count = createExtraCount()
  const reflections_count = createReflectionsCount()
  const superrare_count = createSuperRareCount()
  const ng_edition_10_count = createNGEdition10Count()
  const count = createAppendAddresses()

  // for every address in count, check if its in reflections.body.address, if it is, save it to a new array and return it
  const addresses_to_append = Object.keys(count).filter((address) => {
    if (reflections?.body.address.includes(address)) return true
    return false
  })

  // get the count of each address
  const addresses_to_append_count = addresses_to_append.reduce((acc, curr) => {
    acc[curr] = count[curr] || 0
    return acc
  }, {} as { [x: string]: number })

  // in reflections_count, for every address in addresses_to_append_count, add +1 for every count with max of of the value in reflections.body.address
  for (const address in addresses_to_append_count) {
    if (Object.prototype.hasOwnProperty.call(addresses_to_append_count, address)) {
      const count = addresses_to_append_count[address]
      if (!count) continue
      const max = reflections?.body.address.filter((a) => a === address).length || 0
      const new_count = Math.min(count, max)
      if (!reflections_count) continue
      reflections_count[address] = (reflections_count[address] || 0) + new_count
    }
  }

  // for every address in superrare_count, append count to the count in reflections_count
  for (const address in superrare_count) {
    if (Object.prototype.hasOwnProperty.call(superrare_count, address)) {
      const count = superrare_count[address]
      if (!count) continue
      if (!reflections_count) continue
      reflections_count[address] = (reflections_count[address] || 0) + count
    }
  }

  // for every address in ng_edition_10_count, append count to the count in reflections_count
  for (const address in ng_edition_10_count) {
    if (Object.prototype.hasOwnProperty.call(ng_edition_10_count, address)) {
      const count = ng_edition_10_count[address]
      if (!count) continue
      if (!reflections_count) continue
      reflections_count[address] = (reflections_count[address] || 0) + count
    }
  }

  // for every address in extra, append count to the count in reflections_count
  for (const address in extra_count) {
    if (Object.prototype.hasOwnProperty.call(extra_count, address)) {
      if (!reflections_count) continue
      reflections_count[address] = (reflections_count[address] || 0) + 1
    }
  }

  return res.status(200).json({
    // superrare: superrare_count,
    reflections: reflections_count,
    analytics: {
      totalUniqueAddress: reflections_count && Object.keys(reflections_count).length,
      totalTokens: reflections_count && Object.values(reflections_count).reduce((acc, curr) => acc + curr, 0),
    },
  })
}

export default index

const createAppendAddresses = () => {
  const ww = json.data.all[2]
  const ng_edition_25 = json.data.all[4]
  const ng_oe = json.data.all[5]

  const all_address_to_append = [...(ww?.body.address || []), ...(ng_edition_25?.body.address || []), ...(ng_oe?.body.address || [])]

  // count how many times an address appears
  const count = all_address_to_append.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as { [x: string]: number })
  return count
}

const createReflectionsCount = () => {
  const reflections = json.data.all[1]
  const count = reflections?.body.address.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as { [x: string]: number })
  return count
}

const createSuperRareCount = () => {
  const superrare = json.data.all[0]
  const count = superrare?.body.address.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 3
    return acc
  }, {} as { [x: string]: number })
  return count
}

const createNGEdition10Count = () => {
  const ng_edition_10 = json.data.all[3]
  const count = ng_edition_10?.body.address.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as { [x: string]: number })
  return count
}

const createExtraCount = () => {
  const count = extra.data.body.addresses.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as { [x: string]: number })
  return count
}
