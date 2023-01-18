import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRepositoryCreateDeploymentCreate = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.repository.createContractDeployment.useMutation({
    onSuccess: (data, variables) => {
      if (!data.assetDeployment) return
      ctx.repository.findContractDeploymentByName.setData({ repositoryId, name: data.assetDeployment.name }, data)
      notifySuccess(`You have created a new deployment.`)
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
