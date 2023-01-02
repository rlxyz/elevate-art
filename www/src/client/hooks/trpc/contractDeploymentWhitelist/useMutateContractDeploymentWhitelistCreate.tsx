import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'
import { useQueryContractDeployment } from '../../../components/explore/SaleLayout/useQueryContractDeployment'

export const useMutateContractDeploymentWhitelistCreate = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const { current } = useQueryContractDeployment()
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as s
  return trpc.contractDeploymentWhitelist.create.useMutation({
    onSuccess: (data, variables) => {
      ctx.contractDeploymentWhitelist.findAllowlistByAssetDeploymentId.setData(
        {
          repositoryId,
          name: deploymentName,
        },
        (old) => {
          if (!old) return old
          // const next = produce(old, (draft) => {
          //   draft = [...old, ...data]
          // })
          notifySuccess(`You have saved ${10} new addresses to the whitelist.`)
          return next
        }
      )
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
