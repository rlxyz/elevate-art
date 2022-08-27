interface Config {
  alchemyId: string
  infuraId: string
  testnetEnabled: boolean
  networkId: number
  appName: string
  ethRpcUrl: string
}

export const config: Config = {
  ethRpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL as string,
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID as string,
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID as string,
  testnetEnabled: Boolean(process.env.NEXT_PUBLIC_ENABLE_TESTNETS as string),
  networkId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
  appName: 'Elevate',
}
