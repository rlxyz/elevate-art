import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { sumBy } from '@utils/object-utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import type * as v from 'src/shared/compiler'

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

  const elements = deployment.layerElements as Prisma.JsonValue as v.Layer[]

  return res.setHeader('Content-Type', 'application/json').send(
    JSON.stringify(
      elements
        .filter((x) => x.traits.length > 0)
        .map((x) => ({
          ...x,
          traits: [...x.traits, { id: `none-${x.id}`, weight: Math.max(0, 100 - sumBy(x.traits || 0, (x) => x.weight)) } as v.Trait],
        }))
        .sort((a, b) => a.priority - b.priority)
    )
  )
}

export default index
