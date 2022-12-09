import React from 'react'

import { SocialButton } from '../SocialButton'

interface SocialMediaLinkProps {
  discordUrl?: string
  twitterUrl?: string
  openseaUrl?: string
}

export const SocialMediaLink: React.FC<SocialMediaLinkProps> = ({ discordUrl, twitterUrl, openseaUrl }) => {
  return (
    <div className='flex w-[100px] items-center mb-0.5'>
      {discordUrl && (
        <SocialButton href={discordUrl}>
          <img src='/images/discord.svg' className='w-[18px]' alt='Discord' />
        </SocialButton>
      )}
      {twitterUrl && (
        <SocialButton href={twitterUrl}>
          <img src='/images/twitter.svg' className='w-[18px]' alt='Twitter' />
        </SocialButton>
      )}
      {openseaUrl && (
        <SocialButton href={openseaUrl}>
          <img src='/images/opensea.svg' className='w-[18px]' alt='Opensea' />
        </SocialButton>
      )}
    </div>
  )
}
