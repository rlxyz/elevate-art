import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentPayoutData = ({
  address,
  chainId,
}: {
  address: string | undefined
  chainId: number | undefined
}) => {
  const { data, isLoading, isError } = trpc.contractDeployment.findContractPayoutDataByAddress.useQuery(
    { address: address || '', chainId: chainId || 99 },
    { enabled: !!address || !!chainId }
  )
  return { all: data, isLoading, isError }
}
