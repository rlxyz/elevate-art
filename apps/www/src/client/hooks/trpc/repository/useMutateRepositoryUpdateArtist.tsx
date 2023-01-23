import produce from 'immer'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateRepositoryUpdateArtist = () => {
  const { ctx, notifyError, notifySuccess } = useMutationContext()
  const router: NextRouter = useRouter()
  const r: string = router.query.repository as string
  const o: string = router.query.organisation as string
  return trpc.repository.updateArtistName.useMutation({
    onSuccess: (data) => {
      ctx.repository.findByName.setData({ repositoryName: r, organisationName: o }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.artist = data.artist
        })
        notifySuccess(`You have updated the token name.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
