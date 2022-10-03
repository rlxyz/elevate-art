import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const useQueryOrganisation = () => {
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { data: session } = useSession()
  const {
    data: organisations,
    isLoading,
    isError,
  } = trpc.useQuery(['organisation.getManyOrganisationByUserId', { id: session?.user?.id || '' }])
  const { data: pendings } = trpc.useQuery(['organisation.getManyPendingOrganisationByUserId', { id: session?.user?.id || '' }])

  if (!session) {
    return {
      all: undefined,
      current: undefined,
      isLoading: true,
      isError: false,
    }
  }

  return {
    all: organisations,
    pendings,
    current: organisations?.find((o) => o.name === organisationName),
    isLoading,
    isError: isError,
  }
}
