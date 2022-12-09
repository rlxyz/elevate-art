interface Config {
  alchemyId: string
  infuraId: string
  testnetEnabled: boolean
  logrocketKey: string
  totalPriceAllocation: number[]
  contractAddress: string
  networkId: number
  appName: string
}

export const config: Config = {
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID as string,
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID as string,
  testnetEnabled: Boolean(process.env.NEXT_PUBLIC_ENABLE_TESTNETS as string),
  logrocketKey: process.env.NEXT_PUBLIC_LOG_ROCKET_KEY as string,
  totalPriceAllocation: process.env.NEXT_PUBLIC_TOTAL_PRICE_ALLOCATION?.split(',').map(
    val => Number(val),
  ),
  networkId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
  appName: 'RLXYZ Studio',
}
