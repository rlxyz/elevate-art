import { SocialButton } from '@components/SocialButton'
import { config } from '@utils/config'
import { useMemo } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'

export const ProjectInfo = () => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isConnected } = useConnect()

  const accountAddress = useMemo(() => {
    if (account && account.address) {
      return `${account.address.substring(0, 5)}...${account.address.substring(
        account.address.length - 5,
      )}`
    }
    return ''
  }, [account])

  const networkName = useMemo(() => {
    if (activeChain) {
      return activeChain.name
    }
    return ''
  }, [activeChain])
  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-between">
      <div className="flex">
        <img src={config.projectProfileImage} />
        <div className="flex flex-col ml-3">
          <div className="mb-1">
            <span className="text-2xl font-bold">{config.projectName}</span>
          </div>
          <div className="flex items-center mb-1">
            <img
              src="/images/supply.svg"
              className="inline-block mr-2"
              alt="Project Supply"
            />
            <span className="text-sm">{`${config.totalSupply} Supply`}</span>
          </div>
          <div className="flex items-center">
            <img src="/images/price.svg" className="inline-block mr-2" alt="NFT Price" />
            <span className="text-sm">{`${config.ethPrice} ETH`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-end">
        <div className="p-4 border border-[#F3F3F3] mb-3 rounded-md flex mt-3 lg:mt-0">
          {isConnected ? (
            <>
              <img src="/images/ethereum.png" className="mr-2" alt="Ethereum Logo" />{' '}
              <span className="font-bold mr-2">{networkName}: </span>
              <span>{accountAddress}</span>
              <button className="ml-3">
                <img src="/images/copy.svg" alt="Copy" />
              </button>
            </>
          ) : (
            <span>Disconnected</span>
          )}
        </div>
        <div className="flex w-[120px] items-center">
          <SocialButton href={config.discordUrl}>
            <img src="/images/discord.svg" className="w-[25px]" alt="Discord" />
          </SocialButton>
          <SocialButton href={config.twitterUrl}>
            <img src="/images/twitter.svg" className="w-[25px]" alt="Twitter" />
          </SocialButton>
          <SocialButton href={config.openseaUrl}>
            <img src="/images/opensea.svg" className="w-[25px]" alt="Opensea" />
          </SocialButton>
        </div>
      </div>
    </div>
  )
}
