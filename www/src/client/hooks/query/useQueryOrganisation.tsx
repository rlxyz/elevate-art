import { trpc } from '@utils/trpc'
import produce, { setAutoFreeze } from 'immer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/shared/enums'

setAutoFreeze(false)

export const useQueryOrganisation = () => {
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { data: session } = useSession()
  const { data: organisations, isLoading, isError } = trpc.useQuery(['organisation.getAll'])
  const { data: pendings } = trpc.useQuery(['organisation.user.invite.getAll'])
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
