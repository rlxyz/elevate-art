import { trpc } from 'src/client/utils/trpc'

export const useQueryOrganisationFindAllRepositoryProduction = ({ organisationName }: { organisationName?: string }) => {
  const {
    data: repositories,
    isLoading,
    isError,
  } = trpc.organisation.findAllRepositoryInProduction.useQuery(
    { organisationName: organisationName || '' },
    {
      enabled: !!organisationName,
    }
  )
  return { all: repositories, isLoading, isError }
}
