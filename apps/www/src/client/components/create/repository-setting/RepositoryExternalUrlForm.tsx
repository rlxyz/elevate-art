import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateExternalUrl } from '@hooks/trpc/repository/useMutateRepositoryUpdateExternalUrl'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryExternalUrlForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateExternalUrl()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      externalUrl: repository?.externalUrl,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.externalUrl) return
        mutate({
          repositoryId: repository?.id,
          externalUrl: data.externalUrl,
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='External URL' description='Added to the metadata of each NFT in your collection. Leave blank if none.' />
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
            aria-invalid={errors.externalUrl ? 'true' : 'false'}
            defaultValue={repository?.externalUrl || ''}
            {...register('externalUrl', {
              required: true,
              maxLength: 40,
              minLength: 3,
              validate: (value) => {
                if (value === repository?.externalUrl) {
                  return 'You supplied the same externalUrl'
                }
              },
            })}
          />
        </div>
        {errors.externalUrl ? (
          <SettingLayout.Error
            message={
              String(errors?.externalUrl?.message)
                ? String(errors.externalUrl.message)
                : errors?.externalUrl.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.externalUrl.type === 'maxLength' || errors?.externalUrl.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid external url'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
