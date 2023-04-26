import type { Prisma } from '@prisma/client'
import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { getImageTokenFromAssetDeployment } from '@server/common/v-create-token-hash'
import type { TokenMetadata } from '@utils/contracts/ContractData'
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

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  /** Fetch Total Supply */
  const totalSupply = await getTotalSupply(address, chainId)
  if (totalSupply.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Fetch All TokenHash's */
  const { contractDeployment, layerElements } = deployment
  const elements = layerElements as Prisma.JsonValue as v.Layer[]

  const allMetadata = await Promise.all(
    Array.from({ length: totalSupply.getValue().toNumber() }, async (_, i) => {
      const response = await getImageTokenFromAssetDeployment({
        deployment,
        contractDeployment,
        layerElements: elements,
        tokenId: i,
      })

      if (!response) {
        return { failed: true }
      }

      const { tokens, vseed } = response

      return {
        name: [deployment.repository.tokenName || '', `#${i}`].join(' '),
        tokenHash: vseed.startsWith('0x') ? vseed : null,
        attributes: tokens.map(([l, t]) => {
          const layerElement = elements.find((x) => x.id === l)
          if (!layerElement) return
          const traitElement = layerElement.traits.find((x) => x.id === t)
          if (!traitElement) return
          return { trait_type: layerElement.name, value: traitElement.name } as {
            trait_type: string | undefined
            value: string | undefined
          }
        }) as { trait_type: string | undefined; value: string | undefined }[] | undefined | null,
      }
    })
  ).then((hashes) => hashes.filter((hash) => !hash.failed).map((hash) => hash as TokenMetadata))

  return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(JSON.stringify({ data: allMetadata }))
}

export default index
