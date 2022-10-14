import { OrganisationDatabaseEnum } from '@elevateart/db/enums'
import { useSession } from '@elevateart/ui-eth-auth'
import { trpc } from '@utils/trpc'
import produce, { setAutoFreeze } from 'immer'
import { useRouter } from 'next/router'
import { OrganisationNavigationEnum } from 'src/types/enums'

setAutoFreeze(false)

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

  // Little hack: change the name of personal organisation to the "You"
  const next = produce(organisations, (draft) => {
    const personal = draft?.find((x) => x.type === OrganisationDatabaseEnum.enum.Personal)
    if (personal) {
      personal.name = OrganisationNavigationEnum.enum.You
    }
  })

  return {
    all: next?.sort((a, b) => {
      if (a.type === OrganisationDatabaseEnum.enum.Personal) {
        return -1
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    }),
    pendings: pendings?.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    currentHref: organisationName,
    current: next?.find((o) => o.name === organisationName),
    isLoading,
    isError: isError,
  }
}
