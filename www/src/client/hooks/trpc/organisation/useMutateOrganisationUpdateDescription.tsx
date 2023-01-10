import produce from 'immer'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateOrganisationUpdateDescription = () => {
  const { ctx, notifyError, notifySuccess } = useMutationContext()
  const router: NextRouter = useRouter()
  return trpc.organisation.updateDescription.useMutation({
    onSuccess: (data, variables) => {
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          const org = draft.find((x) => x.id === data.id)
          if (!org) return
          org.description = data.description
        })
        notifySuccess(`You have updated the description.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
