import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'
import { useAnimationMotionValues } from '../useAnimationMotionValues'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  presale: boolean
  presalePrice: number
  presaleSupply: number
  presaleMaxMintAmount: number
  presaleMaxTransactionAmount: number
  publicSale: boolean
  publicSalePrice: number
  publicSaleMaxMintAmount: number
  publicSaleMaxTransactionAmount: number
}

export const MintDetailsForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const {
    blockchain,
    mintType,
    currentSegment,
    collectionSize,
    pricePerToken,
    contractName,
    artCollection,
    contractSymbol,
    setPresale,
    setPresaleMaxMintAmount,
    setPresaleMaxTransactionAmount,
    setPresalePrice,
    setPresaleSupply,
    setPublicSale,
    setPublicSaleMaxMintAmount,
    setPublicSaleMaxTransactionAmount,
    setPublicSalePrice,

    setCurrentSegment,
  } = useContractCreationStore()

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MintDetailsForm>({
    defaultValues: {
      collectionSize: collectionSize,

      presale: false,
      presalePrice: 0.05,
      presaleSupply: 1000,
      presaleMaxMintAmount: 1,
      presaleMaxTransactionAmount: 1,
      publicSale: false,
      publicSalePrice: 0.05,
      publicSaleMaxMintAmount: 1,
      publicSaleMaxTransactionAmount: 1,
    },
  })

  const onSubmit = ({
    presale,
    presaleSupply,
    presalePrice,
    presaleMaxMintAmount,
    presaleMaxTransactionAmount,
    publicSale,
    publicSalePrice,
    publicSaleMaxMintAmount,
    publicSaleMaxTransactionAmount,
  }: MintDetailsForm) => {
    setPublicSale(publicSale)
    setPublicSalePrice(publicSalePrice)
    setPublicSaleMaxMintAmount(publicSaleMaxMintAmount)
    setPublicSaleMaxTransactionAmount(publicSaleMaxTransactionAmount)
    setPresale(presale)
    setPresalePrice(presalePrice)
    setPresaleSupply(presaleSupply)
    setPresaleMaxMintAmount(presaleMaxMintAmount)
    setPresaleMaxTransactionAmount(presaleMaxTransactionAmount)
    // setCurrentSegment(2)
  }

  const localPresale = watch('presale')
  const localPresaleSupply = watch('presaleSupply')
  const localPresalePrice = watch('presalePrice')
  const localPresaleMaxMintAmount = watch('presaleMaxMintAmount')
  const localPresaleMaxTransactionAmount = watch('presaleMaxTransactionAmount')
  const localPublicSale = watch('publicSale')
  const localPublicSalePrice = watch('publicSalePrice')
  const localPublicSaleMaxMintAmount = watch('publicSaleMaxMintAmount')
  const localPublicSaleMaxTransactionAmount = watch('publicSaleMaxTransactionAmount')
  const { handleClick } = useAnimationMotionValues()
  console.log(watch())

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <ContractForm.Body
          onSubmit={handleSubmit((data) => {
            onSubmit(data)
            handleClick(2)
          })}
        >
          <div className='space-y-3'>
            <ContractForm.Body.ToggleCategory className='' label={`Presale (optional)`}>
              <div className='flex flex-row gap-3 mb-2'>
                <ContractForm.Body.Input
                  {...register('presaleSupply', {
                    required: true,
                    maxLength: {
                      value: 20,
                      message: 'Max length is 20',
                    },
                    minLength: {
                      value: 3,
                      message: 'Max length is 3',
                    },
                    pattern: /^[-/a-z0-9 ]+$/gi,
                    onChange: (e) => {
                      setValue('presaleSupply', e.target.value)
                    },
                  })}
                  label={''}
                  // defaultValue={0.05}
                  description={''}
                  className='col-span-3'
                  error={errors.presaleSupply}
                  placeholder='Supply'
                />
                <ContractForm.Body.Input
                  {...register('presalePrice', {
                    required: true,
                    maxLength: {
                      value: 20,
                      message: 'Max length is 20',
                    },
                    minLength: {
                      value: 3,
                      message: 'Max length is 3',
                    },
                    pattern: /^[-/a-z0-9 ]+$/gi,
                    onChange: (e) => {
                      setValue('presalePrice', e.target.value)
                    },
                  })}
                  label={''}
                  // defaultValue={0.05}
                  description={''}
                  className='col-span-3'
                  error={errors.presalePrice}
                  placeholder='Price'
                />
              </div>
              <ContractForm.Body.ToggleInput
                {...register('presaleMaxMintAmount', {
                  required: true,
                  onChange: (e) => {
                    setValue('presaleMaxMintAmount', e.target.value)
                  },
                })}
                label={'Mints per Wallet Maximum'}
                // defaultValue={0.05}
                description={''}
                className='col-span-3'
                error={errors.presaleMaxMintAmount}
                placeholder='Unlimited mints for all wallets'
              />
              <ContractForm.Body.ToggleInput
                {...register('presaleMaxTransactionAmount', {
                  required: true,
                  onChange: (e) => {
                    setValue('presaleMaxTransactionAmount', e.target.value)
                  },
                })}
                label={'Transactions per Wallet Maximum'}
                // defaultValue={0.05}
                description={''}
                className='col-span-3'
                error={errors.presaleMaxTransactionAmount}
                placeholder='Unlimited transactions for all wallets'
              />
            </ContractForm.Body.ToggleCategory>
            <ContractForm.Body.ToggleCategory className='' label={`Public Sale (optional)`}>
              <ContractForm.Body.Input
                {...register('publicSalePrice', {
                  required: true,
                  onChange: (e) => {
                    setValue('publicSalePrice', e.target.value)
                  },
                })}
                label={''}
                // defaultValue={0.05}
                description={''}
                className='col-span-3'
                error={errors.publicSale}
                placeholder='Price'
              />
              <ContractForm.Body.ToggleInput
                {...register('publicSaleMaxMintAmount', {
                  required: true,
                  onChange: (e) => {
                    setValue('publicSaleMaxMintAmount', e.target.value)
                  },
                })}
                label={'Mints per Wallet Maximum'}
                // defaultValue={0.05}
                description={''}
                className='col-span-3'
                error={errors.publicSaleMaxMintAmount}
                placeholder='Unlimited mints for all wallets'
              />
              <ContractForm.Body.ToggleInput
                {...register('publicSaleMaxTransactionAmount', {
                  required: true,
                  onChange: (e) => {
                    setValue('publicSaleMaxTransactionAmount', e.target.value)
                  },
                })}
                label={'Transactions per Wallet Maximum'}
                // defaultValue={0.05}
                description={''}
                className='col-span-3'
                error={errors.publicSaleMaxTransactionAmount}
                placeholder='Unimited transactions for all wallets'
              />
            </ContractForm.Body.ToggleCategory>
          </div>

          <div>
            <ContractForm.Body.Summary
              presale={localPresale}
              presalePrice={localPresalePrice}
              presaleSupply={localPresaleSupply}
              presaleMaxMintAmount={localPresaleMaxMintAmount}
              presaleMaxTransactionAmount={localPresaleMaxTransactionAmount}
              publicSale={localPublicSale}
              publicSalePrice={localPublicSalePrice}
              publicSaleMaxMintAmount={localPublicSaleMaxMintAmount}
              publicSaleMaxTransactionAmount={localPublicSaleMaxTransactionAmount}
            />
          </div>
        </ContractForm.Body>
      </ContractForm>
    </>
  )
}
