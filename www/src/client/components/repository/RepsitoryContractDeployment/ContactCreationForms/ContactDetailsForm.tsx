import { useForm } from 'react-hook-form'
import { capitalize } from 'src/client/utils/format'
import { ContractForm } from '../ContractForm'

export type ContactDetailsForm = {
  contractName: string
  contractSymbol: string
  mintType: 'on-chain' | 'off-chain'
  blockchain: 'goerli'
}

export const ContactDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactDetailsForm>({
    defaultValues: {
      contractName: '',
      contractSymbol: '',
      mintType: 'off-chain',
      blockchain: 'goerli',
    },
  })

  return (
    <ContractForm>
      <ContractForm.Header
        title='Smart Contract Details'
        description='These are important terms for your contract that you need to finalise before continuing!'
      />
      <ContractForm.Body>
        <ContractForm.Body.Input
          {...register('contractName', {
            required: true,
            maxLength: 20,
            minLength: 3,
            pattern: /^[-/a-z0-9 ]+$/gi,
          })}
          label={'Contract Name'}
          description={'Your contract name on websites like Etherscan'}
          className='col-span-4'
          error={errors.contractName}
        />

        <ContractForm.Body.Input
          {...register('contractSymbol', {
            required: true,
            maxLength: 6,
            minLength: 3,
            pattern: /^[-/a-z0-9 ]+$/gi,
          })}
          label={'Symbol'}
          description={'The name of the token on Etherscan'}
          className='col-span-2'
          error={errors.contractName}
        />

        <div className='col-span-3 flex flex-col'>
          <label className='text-xs font-semibold'>Mint Type</label>
          <div className='flex space-x-3'>
            <div className='h-full flex items-center space-x-2'>
              <ContractForm.Body.Radio
                className=''
                description=''
                {...register('mintType', {})}
                label={'Off-Chain'}
                error={errors.contractName}
              />
            </div>
            <div className='h-full flex items-center space-x-2'>
              <ContractForm.Body.Radio
                className=''
                description=''
                {...register('mintType', {})}
                label={'On-Chain'}
                error={errors.contractName}
              />
              <span className='flex px-2 py-1 items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey text-[0.6rem] font-medium text-black h-fit'>
                <span className='text-darkGrey text-[0.6rem]'>Soon</span>
              </span>
            </div>
          </div>
          <p className='text-[0.6rem] text-darkGrey'>Select the type of mint for the art generation of this collection.</p>
        </div>

        <ContractForm.Body.Select
          {...register('blockchain', { required: true })}
          label={'Blockchain'}
          description={'Select a deployment blockchain'}
          className='col-span-6'
          error={errors.contractName}
        >
          <option value={'goerli'}>{capitalize('goerli')}</option>
        </ContractForm.Body.Select>
      </ContractForm.Body>
    </ContractForm>
  )
}
