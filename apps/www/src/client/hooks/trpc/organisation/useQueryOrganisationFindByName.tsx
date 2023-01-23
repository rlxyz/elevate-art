import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

/** Note, this fetches from a publicProcedure */

export const useQueryOrganisationFindByName = ({ organisationName }: { organisationName: string | null | undefined }) => {
  const router: NextRouter = useRouter()
  const o: string = organisationName || (router.query.organisation as string)
  const { data, isLoading, isError } = trpc.organisation.findByName.useQuery({ name: o }, { enabled: !!o })
  return {
    current: data,
    isLoading,
    isError,
  }
}
