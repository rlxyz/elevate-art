export interface UseContractReads {
  contractAddress: string
  chainId: number
  version: string
  enabled?: boolean
}

export interface UseContractUserRead extends UseContractReads {
  userAdress?: string | null | undefined
}

export type UseContractRead = UseContractReads
