import type { FC } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { capitalize } from 'src/client/utils/format'
import { ContractForm } from '../ContractForm'

export type ContractDetailsForm = {
  contractName: string
  contractSymbol: string
  mintType: 'on-chain' | 'off-chain'
  blockchain: 'goerli'
}

export const ContractDetailsForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContractDetailsForm>({
    defaultValues: {
      contractName: '',
      contractSymbol: '',
      mintType: 'off-chain',
      blockchain: 'goerli',
    },
  })
  console.log(watch())
  const onSubmit: SubmitHandler<ContractDetailsForm> = (data) => console.log('data', data)

  return (
    <ContractForm>
      <ContractForm.Header title={title} description={description} />
      <ContractForm.Body onSubmit={handleSubmit(onSubmit)}>
        <ContractForm.Body.Input
          {...register('contractName', {
            required: true,
            maxLength: 20,
            minLength: 3,
            pattern: /^[-/a-z0-9 ]+$/gi,
            onChange: (e) => {
              setValue('contractName', e.target.value)
            },
          })}
          label={'Contract Name'}
          description={'Your contract name on websites like Etherscan'}
          className='col-span-4'
          placeholder='hellow'
          error={errors.contractName}
        />

        <ContractForm.Body.Input
          {...register('contractSymbol', {
            required: true,
            maxLength: 6,
            minLength: 3,

            pattern: /^[-/a-z0-9 ]+$/gi,
            onChange: (e) => {
              setValue('contractSymbol', e.target.value)
            },
          })}
          label={'Symbol'}
          description={'The name of the token on Etherscan'}
          className='col-span-2'
          placeholder='cont'
          error={errors.contractName}
        />

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
                // error={errors.contractName}
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

                // error={errors.contractName}
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
          description={'Select a deployment blockchain'}
          className='col-span-6'
          // error={errors.contractName}
        >
          <option value={'goerli'}>{capitalize('goerli')}</option>
          <option value={'eth mainnet'}>{capitalize('ethereum')}</option>
        </ContractForm.Body.Select>
        <input type='submit' value='Next >' className='col-span-6' />
      </ContractForm.Body>
    </ContractForm>
  )
}
