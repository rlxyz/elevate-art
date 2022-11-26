import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'

export const useQueryOrganisationsRepository = () => {
  const router = useRouter()
  const organisationId = useOrganisationNavigationStore((state) => state.organisationId)
  const { data: repositories, isLoading, isError } = trpc.useQuery(['organisation.repository.getAll', { id: organisationId || '' }])
  return { all: repositories, isLoading, isError }
}
