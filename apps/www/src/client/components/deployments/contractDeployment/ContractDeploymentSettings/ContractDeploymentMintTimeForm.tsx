import { ContractFormBodyCalendar } from '@components/deployments/contractDeployment/ContactCreationForm/ContractForm'
import SettingLayout from '@components/layout/settings'
import { useForm } from 'react-hook-form'

export type MintTimeForm = {
  current: Date
}

export const ContractDeploymentMintTimeForm = ({
  isLoading,
  currentTime,
  label,
  write,
  setClaimTime,
}: {
  isLoading: boolean
  currentTime: Date | undefined
  label: string
  write: () => void
  setClaimTime: (time: Date) => void
}) => {
  // write a hook form
  const { handleSubmit, register, setValue } = useForm<MintTimeForm>({
    defaultValues: {
      current: currentTime,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        const { current } = data
        setClaimTime(current)
        write()
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title={label} />
      <SettingLayout.Body>
        <div className='space-y-2'>
          <div className='py-2 flex flex-col space-y-1'>
            <span className='text-xs font-semibold'>Start Time</span>
            <span className='text-xs '>{currentTime?.toString()}</span>
          </div>
          <ContractFormBodyCalendar
            {...register(`current`, {
              required: true,
              valueAsDate: true,
              onChange: (e) => {
                if (e.target.value) {
                  setValue(`current`, e.target.value)
                }
              },
            })}
            defaultValue={currentTime}
            label={'Start Time'}
          />
        </div>
      </SettingLayout.Body>
    </SettingLayout>
  )
}
