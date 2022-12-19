import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  pricePerToken: number
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
    setCollectionSize,
    setPricePerToken,
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
      pricePerToken: pricePerToken,
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
    collectionSize,
    pricePerToken,
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
    setCollectionSize(collectionSize)
    setPricePerToken(pricePerToken)

    setCurrentSegment(2)
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

  console.log(watch())

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <ContractForm.Body onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ContractForm.Body.ToggleInput
              {...register('presalePrice', {
                required: true,
                onChange: (e) => {
                  setValue('presalePrice', e.target.value)
                },
              })}
              label={'Presale (optional)'}
              // defaultValue={0.05}
              description={''}
              className='col-span-3'
              error={errors.presale}
              placeholder='Supply'
            />
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
            <ContractForm.Body.ToggleInput
              {...register('publicSalePrice', {
                required: true,
                onChange: (e) => {
                  setValue('publicSalePrice', e.target.value)
                },
              })}
              label={'Public Sale (optional)'}
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

            <ContractForm.Body.Input
              {...register('collectionSize', {
                required: true,
                onChange: (e) => {
                  setValue('collectionSize', e.target.value)
                },
              })}
              label={'Total Supply'}
              description={'The size of the collection'}
              className='col-span-3'
              error={errors.collectionSize}
              placeholder='10000'
            />
            <ContractForm.Body.Input
              {...register('pricePerToken', {
                required: true,
                onChange: (e) => {
                  setValue('pricePerToken', e.target.value)
                },
              })}
              label={'Price (ether)'}
              // defaultValue={0.05}
              description={'The cost of each NFT in the collection'}
              className='col-span-3'
              error={errors.collectionSize}
              placeholder='0.05'
            />
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
