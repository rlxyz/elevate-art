import { trpc } from 'src/client/utils/trpc'

/** Note, this fetches from a publicProcedure */

export const useQueryOrganisationFindByName = ({ name }: { name: string }) => {
  const { data, isLoading, isError } = trpc.organisation.findByName.useQuery({ name })
  return {
    current: data,
    isLoading,
    isError,
  }
}
