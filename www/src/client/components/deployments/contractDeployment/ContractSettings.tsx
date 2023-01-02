import { NextLinkWithHoverHueComponent } from '@components/layout/link/NextLinkWithHoverHueComponent'
import useContractCreationStore from '@hooks/store/useContractCreationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { capitalize } from 'src/client/utils/format'
import type { ContractDetailsForm } from './ContactCreationForms/ContactDetailsForm'
import { ContractForm } from './ContractForm'

export const SettingsNavigations: FC<{ routes: { name: string; href: string; selected: boolean }[] }> = ({ routes }) => {
  return (
    <div>
      {routes.map(({ name, href, selected }) => {
        return (
          <NextLinkWithHoverHueComponent key={name} href={href} enabled={selected}>
            {capitalize(name)}
          </NextLinkWithHoverHueComponent>
        )
      })}
    </div>
  )
}

export const ContractGeneralSettings = () => {
  const { current: organisation } = useQueryOrganisationFindAll()

  const {
    currentSegment,
    contractName,
    contractSymbol,
    mintType,
    blockchain,
    artCollection,
    setContractName,
    setContractSymbol,
    setMintType,
    setBlockchain,
    setCurrentSegment,
    setArtCollection,
  } = useContractCreationStore()

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      contractName: contractName,
      contractSymbol: contractSymbol,
      mintType: mintType,
      blockchain: blockchain,
      artCollection: artCollection,
    },
  })

  const onSubmit = ({ contractName, contractSymbol, mintType, blockchain, artCollection }: ContractDetailsForm) => {
    setContractName(contractName)
    setContractSymbol(contractSymbol)
    setMintType(mintType)
    setBlockchain(blockchain)
    setArtCollection(artCollection)
    setCurrentSegment(currentSegment + 1)
  }

  const localContractName = watch('contractName')
  const localContractSymbol = watch('contractSymbol')
  const localArtCollection = watch('artCollection')
  const localBlockchain = watch('blockchain')

  return (
    <div>
      <h1 className='font-semibold py-2'>Mint Details</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='w-3/4'>
        <div className='w-full '>
          <ContractForm.Body.Input
            {...register('contractName', {
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
                setValue('contractName', e.target.value)
              },
            })}
            label={'Contract Name'}
            description={'Your contract name on websites like Etherscan'}
            className='col-span-4'
            placeholder={contractName}
            error={errors.contractName}
            maxLength={20}
          />

          <ContractForm.Body.Input
            {...register('contractSymbol', {
              required: true,
              maxLength: {
                value: 6,
                message: 'Max length is 6',
              },
              minLength: {
                value: 3,
                message: 'Min length is 3',
              },

              pattern: /^[-/a-z0-9 ]+$/gi,
              onChange: (e) => {
                setValue('contractSymbol', e.target.value.toUpperCase())
              },
            })}
            label={'Symbol'}
            description={'The name of the token on Etherscan'}
            className='col-span-2'
            placeholder={contractSymbol}
            error={errors.contractSymbol}
            maxLength={6}
          />
          <ContractForm.Body.Select
            {...register('artCollection', {
              required: true,
              onChange: (e) => {
                setValue('artCollection', e.target.value)
              },
            })}
            label={'Art Collection'}
            description={`Select which collection you're using from Elevate Art`}
            className='col-span-6'
            error={errors.artCollection}
            defaultValue={artCollection}
          >
            <option value={'main'}>{'main'}</option>
            <option value={'development'}>{'development'}</option>
          </ContractForm.Body.Select>

          <div className='col-span-3 flex flex-col'>
            <label className='text-xs font-semibold'>Mint Type</label>
            <div className='flex space-x-3'>
              <div className='h-full flex items-center space-x-2'>
                <ContractForm.Body.Radio
                  className=''
                  description=''
                  {...register('mintType', {
                    onChange: (e) => {
                      setValue('mintType', 'off-chain')
                    },
                  })}
                  label={'Off-Chain'}
                  error={errors.mintType}
                  checked={true}
                />
              </div>
              <div className='h-full flex items-center space-x-2'>
                <ContractForm.Body.Radio
                  className=''
                  description=''
                  {...register('mintType', {
                    onChange: (e) => {
                      setValue('mintType', 'on-chain')
                    },
                  })}
                  label={'On-Chain'}
                  disabled={true}
                  error={errors.mintType}
                />
                <span className='flex px-2 py-1 items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey text-[0.6rem] font-medium text-black h-fit'>
                  <span className='text-darkGrey text-[0.6rem]'>Soon</span>
                </span>
              </div>
            </div>
            <p className='text-[0.6rem] text-darkGrey'>Select the type of mint for the art generation of this collection.</p>
          </div>

          <ContractForm.Body.Select
            {...register('blockchain', {
              required: true,
              onChange: (e) => {
                setValue('blockchain', e.target.value)
              },
            })}
            label={'Blockchain'}
            description={'Select which blockchain you’re launching your NFT collection on'}
            className='col-span-6'
            error={errors.blockchain}
            defaultValue={blockchain}
          >
            <option value={'goerli'}>{capitalize('goerli')}</option>
            <option value={'mainnet'}>{capitalize('mainnet')}</option>
          </ContractForm.Body.Select>
        </div>
        <button
          className='col-span-7 border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
          type='submit'
        >
          Save
        </button>
      </form>
    </div>
  )
}
