interface Config {
  projectName: string
  projectDescription: string
  keywords: string
  projectWebsiteUrl: string
  projectOwner: string
  projectImage: string
  projectProfileImage: string
  projectBannerImage: string
  alchemyId: string
  infuraId: string
  testnetEnabled: boolean
  totalSupply: number
  ethPrice: number
  discordUrl: string
  twitterUrl: string
  openseaUrl: string
  logrocketKey: string
  contractAddress: string
  maxPublicAllocationPerAddress: number
}

export const config: Config = {
  projectName: process.env.NEXT_PUBLIC_PROJECT_NAME as string,
  projectDescription: process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION as string,
  keywords: process.env.NEXT_PUBLIC_PROJECT_KEYWORDS as string,
  projectWebsiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL as string,
  projectOwner: process.env.NEXT_PUBLIC_PROJECT_OWNER as string,
  projectImage: process.env.NEXT_PUBLIC_PROJECT_IMAGE_URL as string,
  projectProfileImage: process.env.NEXT_PUBLIC_PROJECT_PROFILE_IMAGE_URL as string,
  projectBannerImage: process.env.NEXT_PUBLIC_PROJECT_BANNER_IMAGE_URL as string,
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID as string,
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID as string,
  testnetEnabled: Boolean(process.env.NEXT_PUBLIC_ENABLE_TESTNETS as string),
  totalSupply: Number(process.env.NEXT_PUBLIC_TOTAL_SUPPLY || 0),
  ethPrice: Number(process.env.NEXT_PUBLIC_ETH_PRICE || 0),
  discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL as string,
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL as string,
  openseaUrl: process.env.NEXT_PUBLIC_OPENSEA_URL as string,
  logrocketKey: process.env.NEXT_PUBLIC_LOG_ROCKET_KEY as string,
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
  maxPublicAllocationPerAddress: Number(
    process.env.NEXT_PUBLIC_MAX_PUBLIC_ALLOCATION_PER_ADDRESS || 0,
  ),
}
