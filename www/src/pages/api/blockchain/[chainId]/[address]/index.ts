import { AssetDeploymentType } from '@prisma/client'
import { getCollectionSize } from '@server/common/ethers-get-contract-collection-size'
import { getContractName } from '@server/common/ethers-get-contract-name'
import { getContractOwner } from '@server/common/ethers-get-contract-owner'
import { getContractSymbol } from '@server/common/ethers-get-contract-symbol'
import type { ContractInformationData } from '@utils/contracts/ContractData'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, address: address } = req.query as unknown as {
    chainId: number
    address: string
  }

  const name = (await getContractName(address, chainId)).getValue()
  const symbol = (await getContractSymbol(address, chainId)).getValue()
  const owner = (await getContractOwner(address, chainId)).getValue()
  const collectionSize = (await getCollectionSize(address, chainId)).getValue()

  const contract: ContractInformationData = {
    name,
    symbol,
    owner,
    mintType: AssetDeploymentType.BASIC,
    chainId,
    collectionSize,
  }

  return res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=59').json(contract)
}

export default handler
