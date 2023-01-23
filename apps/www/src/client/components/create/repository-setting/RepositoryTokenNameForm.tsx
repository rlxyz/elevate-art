import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateTokenName } from '@hooks/trpc/repository/useMutateRepositoryUpdateTokenName'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryTokenNameForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateTokenName()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: repository?.tokenName,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.name) return
        mutate({
          repositoryId: repository?.id,
          tokenName: data.name,
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Token Name' description='Added to the name of each NFT in your collection, e.g BAYC #2321' />
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
            aria-invalid={errors.name ? 'true' : 'false'}
            defaultValue={repository?.tokenName}
            {...register('name', {
              required: true,
              maxLength: 25,
              minLength: 3,
              pattern: /^[a-zA-Z0-9-]+$/,
              validate: (value) => {
                if (value === repository?.tokenName) {
                  return 'You supplied the same token name'
                }
              },
            })}
          />
        </div>
        {errors.name ? (
          <SettingLayout.Error
            message={
              String(errors?.name?.message)
                ? String(errors.name.message)
                : errors?.name.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.name.type === 'maxLength' || errors?.name.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid project name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
