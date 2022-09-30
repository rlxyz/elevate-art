import { trpc } from '@utils/trpc'
import { NextRouter, useRouter } from 'next/router'

export const useQueryOrganisation = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const { data, isLoading, isError } = trpc.useQuery(['organisation.getOrganisationByName', { name: organisationName }])
  return { current: data, isLoading, isError }
}
