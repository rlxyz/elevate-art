import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'

export const useQueryOrganisation = () => {
  const organisationId = useOrganisationNavigationStore((state) => state.organisationId)
  const { data: session } = useSession()
  const {
    data: organisations,
    isLoading,
    isError,
  } = trpc.useQuery(['organisation.getManyOrganisationByUserId', { id: session?.user?.id || '' }])
  const { data: pendings } = trpc.useQuery([
    'organisation.getManyPendingOrganisationByUserId',
    { address: session?.user?.address || '' },
  ])
  return { all: organisations, pendings, current: organisations?.find((o) => o.id === organisationId), isLoading, isError }
}
