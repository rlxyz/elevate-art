import { OrganisationNavigationEnum } from '@utils/enums'
import produce from 'immer'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { routeBuilder } from 'src/client/utils/format'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateOrganisationUpdateName = () => {
  const { ctx, notifyError, notifySuccess } = useMutationContext()
  const router: NextRouter = useRouter()
  return trpc.organisation.updateName.useMutation({
    onSuccess: (data, variables) => {
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          const org = draft.find((x) => x.id === data.id)
          if (!org) return
          org.name = data.name
        })
        notifySuccess(`You have updated the organisation name.`)
        router.push(routeBuilder(data.name, OrganisationNavigationEnum.enum.Settings))
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
