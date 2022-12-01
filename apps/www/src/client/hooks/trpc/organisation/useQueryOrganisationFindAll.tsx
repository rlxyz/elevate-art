<<<<<<<< HEAD:apps/www/src/hooks/query/useQueryOrganisation.tsx
import { OrganisationDatabaseEnum } from '@elevateart/db/enums'
import { useSession } from '@elevateart/eth-auth'
import { trpc } from '@utils/trpc'
========
>>>>>>>> staging:apps/www/src/client/hooks/trpc/organisation/useQueryOrganisationFindAll.tsx
import produce, { setAutoFreeze } from 'immer'
import { useRouter } from 'next/router'
<<<<<<<< HEAD:apps/www/src/hooks/query/useQueryOrganisation.tsx
import { OrganisationNavigationEnum } from 'src/types/enums'
========
import { trpc } from 'src/client/utils/trpc'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/shared/enums'
>>>>>>>> staging:apps/www/src/client/hooks/trpc/organisation/useQueryOrganisationFindAll.tsx

setAutoFreeze(false)

export const useQueryOrganisationFindAll = () => {
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { data: session } = useSession()
  const { data: organisations, isLoading, isError } = trpc.organisation.findAll.useQuery()
  const { data: pendings } = trpc.organisation.findAllInvites.useQuery()
  if (!session) {
    return {
      all: undefined,
      current: undefined,
      isLoading: true,
      isError: false,
    }
  }

  // @todo remove this when we have a better way to handle this
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
