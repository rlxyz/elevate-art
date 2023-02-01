import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateHeight } from '@hooks/trpc/repository/useMutateRepositoryUpdateHeight'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryImageHeightForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateHeight()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      height: repository?.height,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.height) return
        mutate({
          repositoryId: repository?.id,
          height: Number(data.height),
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Image Height' description='Set the image height for the project' />
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
            aria-invalid={errors.height ? 'true' : 'false'}
            defaultValue={repository?.height}
            {...register('height', {
              required: true,
              maxLength: 25,
              minLength: 3,
              pattern: /^[a-zA-Z0-9-]+$/,
              validate: (value) => {
                if (value === repository?.height) {
                  return 'You supplied the same height'
                }
              },
            })}
          />
        </div>
        {errors.height ? (
          <SettingLayout.Error
            message={
              String(errors?.height?.message)
                ? String(errors.height.message)
                : errors?.height.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.height.type === 'maxLength' || errors?.height.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid project name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
