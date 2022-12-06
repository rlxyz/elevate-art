import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import produce from 'immer'
import router from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRepositoryCreateBucket = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryName: string = router.query.repository as string
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.repository.createBucket.useMutation({
    onSuccess: (data, variables) => {
      ctx.repository.findByName.setData({ name: repositoryName }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.bucket = true
        })
        notifySuccess(`You can now create new deployments.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
