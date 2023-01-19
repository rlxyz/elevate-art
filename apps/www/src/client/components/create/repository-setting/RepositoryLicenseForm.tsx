import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateLicense } from '@hooks/trpc/repository/useMutateRepositoryUpdateLicense'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryLicenseForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateLicense()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      license: repository?.license,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.license) return
        mutate({
          repositoryId: repository?.id,
          license: data.license,
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='License' description='AAdded to the metadata of each NFT in your collection. Leave blank if none.' />
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
            aria-invalid={errors.license ? 'true' : 'false'}
            defaultValue={repository?.license || ''}
            {...register('license', {
              required: true,
              maxLength: 25,
              minLength: 3,
              validate: (value) => {
                if (value === repository?.license) {
                  return 'You supplied the same license'
                }
              },
            })}
          />
        </div>
        {errors.license ? (
          <SettingLayout.Error
            message={
              String(errors?.license?.message)
                ? String(errors.license.message)
                : errors?.license.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.license.type === 'maxLength' || errors?.license.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid license'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
