import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollectionRarity } from 'src/client/utils/image'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  /** Inputs */
  const { chainId: cid, address, id } = req.query as { chainId: string; address: string; id: string }
  const tokenId = parseInt(id)
  const chainId = parseInt(cid)
  if (!chainId || !address || !id || tokenId < 0 || Number.isNaN(tokenId)) {
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

  /** Validate Deployment */
  const response = await fetch(
    getCollectionRarity({
      contractDeployment: deployment.contractDeployment,
    })
  )
  if (!response.ok) {
    return res.status(404).send('Not Found')
  }

  const tokens = (await response.json()) as {
    rank: number
    index: number
    score: number
  }[]
  if (!tokens || !tokens.length) {
    return res.status(404).send('Not Found')
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    .status(200)
    .send(JSON.stringify({ data: tokens.find((x) => x.index === tokenId) }))
}

export default index
