import { DEFAULT_ALCHEMY_KEY } from '@utils/alchemy'
import { Alchemy, Network } from 'alchemy-sdk'
import type { BigNumberish } from 'ethers'
import { BigNumber } from 'ethers'
import { Result } from '../utils/response-result'
import { getContractTokenOwner } from './ethers-get-contract-token-owner'

export type ContractSnapshot = {
  name: string
  address: string
  contract: 'ERC721' | 'ERC1155'
  chainId: number
  type: 'BY_OPENSEA_API' | 'BY_CONTRACT_CALL' | 'BY_ALCHEMY_API'
  tokenIds: BigNumberish[]
}

const createSnapshot = async (snapshot: ContractSnapshot): Promise<Result<`0x${string}`[]>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { address, chainId, tokenIds, type } = snapshot

      if (type === 'BY_OPENSEA_API') {
        // fetch from opensea
        let url = `https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=${address}&limit=50&include_orders=false`
        while (true) {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              //   'X-API-KEY': env.OPENSEA_API_KEY, //! @todo
            },
          })
          if (!response.ok) {
            console.log('Failed to fetch token owners', await response.text())
            return reject(Result.fail('Failed to fetch token owners'))
          }
          // console.log('response', await response.json())
          const json = (await response.json()) as { assets: { owner: { address: `0x${string}` } }[]; next: string }
          const { assets, next } = json
          const owners = assets.map((asset) => asset.owner?.address || null)
          if (next === null) {
            return resolve(Result.ok(owners))
          } else {
            url = url + '&cursor=' + next
          }
        }
      } else if (type === 'BY_CONTRACT_CALL') {
        // iterate each token id and fetch from getContractTokenOwner
        await Promise.all(
          tokenIds.map(async (tokenId) => {
            const snapshot = await getContractTokenOwner(address, chainId, Number(tokenId.toString()))
            if (snapshot.failed) {
              throw new Error('Failed to fetch token owner' + snapshot.error)
            }
            return snapshot.getValue()
          })
        )
          .then((values) => {
            return resolve(Result.ok(values))
          })
          .catch((err) => {
            return reject(Result.fail(err.message))
          })
      } else if (type === 'BY_ALCHEMY_API') {
        const config = {
          apiKey: DEFAULT_ALCHEMY_KEY,
          network: Network.ETH_MAINNET,
        }

        const alchemy = new Alchemy(config)

        await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              const response = await alchemy.nft.getOwnersForNft(address, BigNumber.from(tokenId))
              return response.owners[0] as `0x${string}`
            } catch (err) {
              console.log('Failed to fetch token owners', err)
              throw new Error('Failed to fetch token owners')
            }
          })
        )
          .then((values) => {
            return resolve(Result.ok(values))
          })
          .catch((err) => {
            return reject(Result.fail(err.message))
          })
      }

      return reject(Result.fail('Invalid snapshot type'))
    } catch (err) {
      if (err instanceof Error) {
        return reject(Result.fail("Couldn't create snapshot" + err.message))
      }
    }
  })
}

export default createSnapshot
