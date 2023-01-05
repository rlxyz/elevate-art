import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentContractInformationData = ({
  address,
  chainId,
}: {
  address: string | undefined
  chainId: number | undefined
}) => {
  const { data, isLoading, isError } = trpc.contractDeployment.findContractDataByAddress.useQuery(
    { address: address || '', chainId: chainId || 99 },
    { enabled: !!address }
  )
  return { all: data, isLoading, isError }
}
