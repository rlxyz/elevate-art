import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'

export const useQueryOrganisationsRepository = () => {
  const router = useRouter()
  const organisationId = useOrganisationNavigationStore((state) => state.organisationId)
  const { data: repositories, isLoading, isError } = trpc.useQuery(['organisation.repository.getAll', { id: organisationId || '' }])
  return { all: repositories, isLoading, isError }
}
