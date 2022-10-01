import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'

export const useQueryOrganisation = () => {
  const { data: session } = useSession()
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const {
    data: organisations,
    isLoading,
    isError,
  } = trpc.useQuery(['organisation.getManyOrganisationByUserId', { id: session?.user?.id || '' }])
  return { all: organisations, current: organisations?.find((o) => o.name === organisationName), isLoading, isError }
}
