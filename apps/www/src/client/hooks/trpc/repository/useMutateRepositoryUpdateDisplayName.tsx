import produce from 'immer'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateRepositoryUpdateDisplayName = () => {
  const { ctx, notifyError, notifySuccess } = useMutationContext()
  const router: NextRouter = useRouter()
  const r: string = router.query.repository as string
  const o: string = router.query.organisation as string
  return trpc.repository.updateDisplayName.useMutation({
    onSuccess: (data) => {
      ctx.repository.findByName.setData({ repositoryName: r, organisationName: o }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.displayName = data.displayName
        })
        notifySuccess(`You have updated the projects display name.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
