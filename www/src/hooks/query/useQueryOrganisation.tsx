import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'

export const useQueryOrganisation = () => {
  const { data: session } = useSession()
  const { data, isLoading, isError } = trpc.useQuery([
    'organisation.getManyOrganisationByUserId',
    { id: session?.user?.id || '' },
  ])
  return { all: data, isLoading, isError }
}
