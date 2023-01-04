import SettingLayout from '@components/layout/settings'
import Textarea from '@components/layout/textarea/Textarea'
import { useMutateContractDeploymentWhitelistCreate } from '@hooks/trpc/contractDeploymentWhitelist/useMutateContractDeploymentWhitelistCreate'
import type { ContractDeployment, WhitelistType } from '@prisma/client'
import { getAddress } from 'ethers/lib/utils.js'
import { useForm } from 'react-hook-form'
import type { AllowlistFormInput, AllowlistFormInputV2 } from './AllowlistLayout'

export const AllowlistLayoutTextarea = ({ contractDeployment, type }: { contractDeployment: ContractDeployment; type: WhitelistType }) => {
  const { mutate } = useMutateContractDeploymentWhitelistCreate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    whitelist: AllowlistFormInputV2
  }>({
    defaultValues: {
      whitelist: '',
    },
  })

  return (
    <SettingLayout
      disabled={false}
      onSubmit={handleSubmit((data) => {
        if (!contractDeployment?.id) return
        const { whitelist } = data
        // treat the value as a comma separated list and parse the address using ethers.utils.getAddress
        const addresses: string[] = whitelist.split(',')
        const parsedAllowlistFormInput: AllowlistFormInput = addresses.map((address) => {
          return {
            address: getAddress(address),
            mint: 1,
          }
        })

        mutate({
          contractDeploymentId: contractDeployment?.id,
          whitelist: parsedAllowlistFormInput,
          type,
        })
      })}
    >
      <SettingLayout.Header title='Whitelist' description='Your whitelist....' />
      <SettingLayout.Body>
        <Textarea
          {...register('whitelist', {
            required: true,
          })}
          rows={5}
          wrap='soft'
          aria-invalid={errors.whitelist ? 'true' : 'false'}
        />
      </SettingLayout.Body>
    </SettingLayout>
  )
}
