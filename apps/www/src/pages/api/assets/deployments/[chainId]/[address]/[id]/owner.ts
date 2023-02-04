import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getContractTokenOwner } from '@server/common/ethers-get-contract-token-owner'
import type { NextApiRequest, NextApiResponse } from 'next'

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

  /** Fetch OwnerOf */
  const ownerOf = await getContractTokenOwner(address, chainId, tokenId)
  if (ownerOf.failed) {
    return res.status(500).send('Internal Server Error')
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    .status(200)
    .send(
      JSON.stringify({
        address: ownerOf.getValue(),
      })
    )
}

export default index
