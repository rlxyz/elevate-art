import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getTokenHash } from '@server/common/ethers-get-contract-token-hash'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { sumBy } from '@utils/object-utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Inputs */
  const { chainId: cid, address } = req.query as { chainId: string; address: string }
  const chainId = parseInt(cid)
  if (!chainId || !address) {
    return res.status(400).send('Bad Request')
  }

  /** Validate Deployment */
  const deployment = await getAssetDeploymentByContractAddressAndChainId({ chainId, address })
  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  /** Fetch Total Supply */
  const totalSupply = await getTotalSupply(address, chainId)
  if (totalSupply.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Fetch All TokenHash's */
  const tokenHashes = await Promise.all(
    Array.from({ length: totalSupply.getValue().toNumber() }, (_, i) => getTokenHash(address, chainId, i))
  ).then((hashes) => hashes.filter((hash) => !hash.failed).map((hash) => hash.getValue()))

  const { contractDeployment, layerElements } = deployment
  const elements = layerElements as Prisma.JsonValue as v.Layer[]

  /** Create Tokens */
  const tokens = v
    .rarity(
      tokenHashes.map((hash) => {
        return v.one(
          v.parseLayer(
            elements
              .filter((x) => x.traits.length > 0)
              .map((x) => ({
                ...x,
                traits: [
                  ...x.traits,
                  { id: `none-${x.id}`, weight: Math.max(0, 100 - sumBy(x.traits || 0, (x) => x.weight)), rules: [] } as v.Trait,
                ] as v.Trait[],
              }))
              .sort((a, b) => a.priority - b.priority)
          ),
          hash
        )
      })
    )
    .sort((a, b) => b.score - a.score)
    .map((x, index) => ({
      ...x,
      rank: index + 1,
    }))

  return res
    .setHeader('Content-Type', 'application/json')
    .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    .status(200)
    .send(JSON.stringify({ data: tokens }))
}

export default index
