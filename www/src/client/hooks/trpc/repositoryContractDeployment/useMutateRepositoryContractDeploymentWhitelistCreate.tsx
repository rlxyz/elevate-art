import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { useQueryContractDeployment } from '../contractDeployment/useQueryContractDeployment'

export const useMutateRepositoryCreateDeploymentWhitelistCreate = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const { current } = useQueryContractDeployment()
  // const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.whitelist.create.useMutation({
    onSuccess: (data, variables) => {
      // ctx.repository.findDeployments.setData({ repositoryId }, (old) => {
      //   if (!old) return old
      //   const next = produce(old, (draft) => {
      //     draft.unshift(data)
      //   })
      //   notifySuccess(`You have created a new deployment.`)
      //   return next
      // })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
