import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { trpc } from 'src/client/utils/trpc'

export const useQueryOrganisationFindAllRepository = () => {
  const organisationId = useOrganisationNavigationStore((state) => state.organisationId)
  const { data: repositories, isLoading, isError } = trpc.organisation.findAllRepository.useQuery({ organisationId: organisationId || '' })
  return { all: repositories, isLoading, isError }
}
