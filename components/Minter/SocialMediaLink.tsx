import { SocialButton } from '@components/SocialButton'
import { config } from '@utils/config'

export const SocialMediaLink = () => {
  return (
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
  )
}
