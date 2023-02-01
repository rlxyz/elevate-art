import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateDisplayName } from '@hooks/trpc/repository/useMutateRepositoryUpdateDisplayName'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryDisplayNameForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateDisplayName()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: repository?.displayName,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.displayName) return
        mutate({
          repositoryId: repository?.id,
          displayName: data.displayName,
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Display Name' description='Used to identify your projects display name on elevate.art' />
      <SettingLayout.Body>
        <div className='w-fit rounded-[5px] border border-mediumGrey'>
          <input
            className={clsx(
              'text-xs p-2 w-full h-full rounded-[5px]',
              'invalid:border-redError invalid:text-redError',
              'focus:invalid:border-redError focus:invalid:ring-redError',
              'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:ring-none disabled:border-none'
            )}
            aria-invalid={errors.displayName ? 'true' : 'false'}
            defaultValue={repository?.displayName || ''}
            {...register('displayName', {
              required: true,
              maxLength: 25,
              minLength: 3,
              pattern: /^[a-zA-Z0-9-]+$/,
              validate: (value) => {
                if (value === repository?.displayName || '') {
                  return 'You supplied the same display name name'
                }
              },
            })}
          />
        </div>
        {errors.displayName ? (
          <SettingLayout.Error
            message={
              String(errors?.displayName?.message)
                ? String(errors.displayName.message)
                : errors?.displayName.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.displayName.type === 'maxLength' || errors?.displayName.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid display name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
