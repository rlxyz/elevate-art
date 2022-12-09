import React from 'react'
import { EtherscanIcon } from '../EtherscanIcon'

import { SocialButton } from '../SocialButton'

interface SocialMediaLinkProps {
  discordUrl?: string
  twitterUrl?: string
  openseaUrl?: string
  etherscanUrl?: string
}

export const SocialMediaLink: React.FC<SocialMediaLinkProps> = ({ discordUrl, twitterUrl, openseaUrl, etherscanUrl }) => {
  return (
    <div className='flex w-[100px] space-x-3 items-center mb-0.5'>
      {discordUrl && (
        <SocialButton href={discordUrl}>
          <EtherscanIcon />
        </SocialButton>
      )}
      {twitterUrl && (
        <SocialButton href={twitterUrl}>
          <EtherscanIcon />
        </SocialButton>
      )}
      {openseaUrl && (
        <SocialButton href={openseaUrl}>
          <EtherscanIcon />
        </SocialButton>
      )}
      {etherscanUrl && (
        <SocialButton href={etherscanUrl}>
          <EtherscanIcon />
        </SocialButton>
      )}
    </div>
  )
}
