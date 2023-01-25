import SettingLayout from '@components/layout/settings'
import Textarea from '@components/layout/textarea/Textarea'
import { useMutateContractDeploymentWhitelistCreate } from '@hooks/trpc/contractDeploymentWhitelist/useMutateContractDeploymentWhitelistCreate'
import type { ContractDeployment, ContractDeploymentAllowlistType } from '@prisma/client'
import { getAddress } from 'ethers/lib/utils.js'
import { useForm } from 'react-hook-form'
import type { AllowlistFormInput, AllowlistFormInputV2 } from './AllowlistLayout'

export const AllowlistLayoutTextarea = ({
  contractDeployment,
  type,
}: {
  contractDeployment: ContractDeployment
  type: ContractDeploymentAllowlistType
}) => {
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
        const addresses: string[] = whitelist.split('\n')

        const parsedAllowlistFormInput: AllowlistFormInput = addresses
          .map((x) => {
            const [address, mint] = x.split(',')
            if (!address || !mint)
              return {
                address: '' as `0x${string}`,
                mint: 0,
              }
            return {
              address: getAddress(address),
              mint: Number(mint),
            }
          })
          .filter((x) => Boolean(x.address))
          .filter((x) => Boolean(x.mint))

        mutate({
          contractDeploymentId: contractDeployment?.id,
          whitelist: parsedAllowlistFormInput,
          type,
        })
      })}
    >
      <SettingLayout.Header
        title='ContractDeploymentAllowlist'
        description='Please pass in your whitelist in csv format; <address>,<mint>'
      />
      <SettingLayout.Body>
        <Textarea
          {...register('whitelist', {
            required: true,
            // validate: async (v) => {
            //   if (String(v).endsWith('.eth')) {
            //     const address = await getAddressFromEns(v)
            //     if (!address) return false
            //     return ethers.utils.isAddress(address)
            //   }
            //   return ethers.utils.isAddress(v)
            // },
          })}
          rows={5}
          wrap='soft'
          aria-invalid={errors.whitelist ? 'true' : 'false'}
        />
        {/* {errors.whitelist && (
          <span className='text-xs text-redError'>
            {errors.whitelist?.type === 'required'
              ? // validate input with address, mint and comma

                'This field is required'
              : errors.whitelist?.type === 'pattern'
              ? 'We only accept - and / for special characters'
              : errors.whitelist?.type === 'validate'
              ? 'A layer with this name already exists'
              : 'Must be between 3 and 20 characters long'}
          </span>
        )} */}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
