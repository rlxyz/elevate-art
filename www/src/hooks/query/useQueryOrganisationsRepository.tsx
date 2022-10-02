import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { trpc } from '@utils/trpc'

export const useQueryOrganisationsRepository = () => {
  const organisationId = useOrganisationNavigationStore((state) => state.organisationId)
  const {
    data: repositories,
    isLoading,
    isError,
  } = trpc.useQuery(['organisation.getManyRepositoryByOrganisationId', { id: organisationId || '' }])
  return { all: repositories, isLoading, isError }
}
