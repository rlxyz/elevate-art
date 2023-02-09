import { getAssetDeploymentByContractAddressAndChainId } from '@server/common/db-get-asset-deployment-by-production-branch'
import { getClaimTime } from '@server/common/ethers-get-contract-claim-time'
import { getMintPrice } from '@server/common/ethers-get-contract-mint-price'
import { getContractName } from '@server/common/ethers-get-contract-name'
import { getContractOwner } from '@server/common/ethers-get-contract-owner'
import { getPresaleTime } from '@server/common/ethers-get-contract-presale-time'
import { getPublicTime } from '@server/common/ethers-get-contract-public-time'
import { getContractSymbol } from '@server/common/ethers-get-contract-symbol'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import type { NextApiRequest, NextApiResponse } from 'next'

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

  /** Fetch MintPrice */
  const mintPrice = await getMintPrice(address, chainId)
  if (mintPrice.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Fetch publicTime */
  const publicTime = await getPublicTime(address, chainId)
  if (publicTime.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Fetch claimTime */
  const claimTime = await getClaimTime(address, chainId)
  if (claimTime.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Fetch presaleTime */
  const presaleTime = await getPresaleTime(address, chainId)
  if (presaleTime.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Owner */
  const ownerOf = await getContractOwner(address, chainId)
  if (ownerOf.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Name */
  const name = await getContractName(address, chainId)
  if (name.failed) {
    return res.status(500).send('Internal Server Error')
  }

  /** Symbol */
  const symbol = await getContractSymbol(address, chainId)
  if (symbol.failed) {
    return res.status(500).send('Internal Server Error')
  }

  return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(
      JSON.stringify({
        data: {
          name: name.getValue(),
          symbol: symbol.getValue(),
          ownerOf: ownerOf.getValue(),
          totalSupply: totalSupply.getValue().toString(),
          mintPrice: mintPrice.getValue().toString(),
          claimTime: claimTime.getValue(),
          presaleTime: presaleTime.getValue(),
          publicTime: publicTime.getValue(),
        },
      })
    )
}

export default index
